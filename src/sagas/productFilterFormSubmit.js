/* eslint-disable no-constant-condition */
import { all, put, select, take, call } from 'redux-saga/effects';
import { isEmpty, trim, uniq } from 'lodash';
import { change, getFormValues, startSubmit, stopSubmit } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import {
  PRODUCT_FEATURE_TAG_FORM,
  PRODUCT_FILTER_FORM
} from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import CreateProductFeatureMutation from '../graphql/mutations/CreateProductFeature';
import CreateProductFeatureProductMutation from '../graphql/mutations/CreateProductFeatureProduct';
import CreateProductComponentBaseMutation from '../graphql/mutations/CreateProductComponentBase';
import CreateProductComponentBaseProductMutation from '../graphql/mutations/CreateProductComponentBaseProduct';
import CreateProductComponentOtherMutation from '../graphql/mutations/CreateProductComponentOther';
import CreateProductComponentOtherProductMutation from '../graphql/mutations/CreateProductComponentOtherProduct';
import CreateProductCategoryMutation from '../graphql/mutations/CreateProductCategory';
import UpdateProductByIdMutation from '../graphql/mutations/UpdateProduct';
import selectViewerUserId from '../selectors/viewerUserId';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import { labelObjectsToCsv, labelObjectsToValue } from '../utils/sagaHelper';
import gql from 'graphql-tag';
import confirmationSaga from './confirmationSaga';
import appToastAdd from '../actions/appToastAdd';

const getIncludedValues = values => {
  const filtered = values.filter(v => !v.out);
  return filtered.length > 0 ? filtered : undefined;
};
const getExcludedValues = values => {
  const filtered = values.filter(v => !!v.out);
  return filtered.length > 0 ? filtered : undefined;
};

const labelObjectsToCsvWithNegative = values =>
  values.map(v => (!v.out ? v.value : `~${v.value}`)).join(',');

const FeaturesQuery = gql`
  query FeaturesQuery($producerIds: [Int!], $feature: String!) {
    allProductFeatures(
      filter: { producerId: { in: $producerIds } }
      condition: { name: $feature }
    ) {
      nodes {
        id
        producerId
        name
      }
    }
  }
`;

const CategoriesQuery = gql`
  query FeaturesQuery($producerIds: [Int!], $category: String!) {
    allProductCategories(
      filter: { producerId: { in: $producerIds } }
      condition: { name: $category }
    ) {
      nodes {
        id
        producerId
        name
      }
    }
  }
`;

const ComponentBasesQuery = gql`
  query ComponentBasesQuery($producerIds: [Int!], $componentBase: String!) {
    allProductComponentBases(
      filter: { producerId: { in: $producerIds } }
      condition: { name: $componentBase }
    ) {
      nodes {
        id
        producerId
        name
      }
    }
  }
`;

const ComponentOthersQuery = gql`
  query ComponentOthersQuery($producerIds: [Int!], $componentOther: String!) {
    allProductComponentOthers(
      filter: { producerId: { in: $producerIds } }
      condition: { name: $componentOther }
    ) {
      nodes {
        id
        producerId
        name
      }
    }
  }
`;

const CreateProductFilterCriterionMutation = gql`
  mutation CreateProductFilterCriterionMutation(
    $productFilterCriterion: ProductFilterCriterionInput!
  ) {
    createProductFilterCriterion(
      input: { productFilterCriterion: $productFilterCriterion }
    ) {
      productFilterCriterion {
        id
      }
    }
  }
`;

const CreateProductFilterVersionMutation = gql`
  mutation CreateProductFilterVersionMutation(
    $productFilterVersion: ProductFilterVersionInput!
  ) {
    createProductFilterVersion(
      input: { productFilterVersion: $productFilterVersion }
    ) {
      productFilterVersion {
        id
      }
    }
  }
`;

const FilteredProductsQuery = gql`
  query FilteredProductIdsQuery(
    $condition: ProductCondition
    $filter: ProductFilter
  ) {
    products: allProducts(condition: $condition, filter: $filter) {
      nodes {
        id
      }
    }
  }
`;

export function* productTagFeatureSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === PRODUCT_FEATURE_TAG_FORM
    );
    yield put(startSubmit(PRODUCT_FEATURE_TAG_FORM));

    const values = yield select(getFormValues(PRODUCT_FEATURE_TAG_FORM));
    const { selectedProducts } = yield select(
      getFormValues(PRODUCT_FILTER_FORM)
    );

    const rawFeature = values.feature && values.feature.value;
    const isNewFeature = values.feature && values.feature.__isNew__;
    const rawCategory = values.category && values.category.value;
    const isNewCategory = values.category && values.category.__isNew__;
    const rawComponentBase = values.componentBase && values.componentBase.value;
    const isNewComponentBase =
      values.componentBase && values.componentBase.__isNew__;
    const rawComponentOther =
      values.componentOther && values.componentOther.value;
    const isNewComponentOther =
      values.componentOther && values.componentOther.__isNew__;

    try {
      const feature = trim(rawFeature).toLowerCase();
      const componentBase = trim(rawComponentBase).toLowerCase();
      const componentOther = trim(rawComponentOther).toLowerCase();
      const category = trim(rawCategory).toLowerCase();

      const isConfirm = yield call(confirmationSaga, {
        title: 'Tag Product with Feature',
        message: `Do you want to tag ${selectedProducts.length} products?`
      });

      if (isConfirm) {
        // FEATURES
        // check if feature already added to product
        const productsToAddFeature = feature
          ? selectedProducts.filter(
              p =>
                p.features.nodes.find(
                  f => f.feature.name.toLowerCase() === feature
                ) === undefined
            )
          : [];

        if (productsToAddFeature.length > 0) {
          // unique producerIds
          const producerIds = uniq(productsToAddFeature.map(p => p.producerId));

          if (isNewFeature) {
            yield graphqlClient.mutate({
              mutation: CreateProductFeatureMutation,
              variables: {
                productFeature: {
                  name: feature,
                  producerId: producerIds[0]
                }
              },
              refetchQueries: ['AllProductFeaturesQuery']
            });
          }

          // get features
          const featuresInDb = yield graphqlClient.query({
            query: FeaturesQuery,
            variables: {
              producerIds: producerIds,
              feature: feature
            },
            fetchPolicy: 'network-only'
          });

          const producerIdToFeatureIdMap = {};

          featuresInDb.data.allProductFeatures.nodes.forEach(
            f => (producerIdToFeatureIdMap[f.producerId] = f.id)
          );

          // Add Product Feature Products Relationship
          yield all(
            productsToAddFeature.map(product => {
              const productFeatureProduct = {
                productId: product.id,
                productFeatureId: producerIdToFeatureIdMap[product.producerId]
              };
              return graphqlClient.mutate({
                mutation: CreateProductFeatureProductMutation,
                variables: {
                  productFeatureProduct
                },
                refetchQueries: ['FilteredProductsQuery']
              });
            })
          );

          yield put(
            appToastAdd({
              durationMilliseconds: 4000,
              title: 'Product Tagged Successfully',
              message: `${
                productsToAddFeature.length
              } Products tagged with "${feature}"`,
              toastKey: `toast_${Date.now()}`
            })
          );
        }

        const productsToAddComponentBase = componentBase
          ? selectedProducts.filter(
              p =>
                p.componentBases.nodes.find(
                  cb => cb.componentBase.name.toLowerCase() === componentBase
                ) === undefined
            )
          : [];

        if (productsToAddComponentBase.length > 0) {
          // unique producerIds
          const producerIds = uniq(
            productsToAddComponentBase.map(p => p.producerId)
          );

          if (isNewComponentBase) {
            yield graphqlClient.mutate({
              mutation: CreateProductComponentBaseMutation,
              variables: {
                productComponentBase: {
                  name: componentBase,
                  producerId: producerIds[0]
                }
              },
              refetchQueries: ['AllProductComponentBasesQuery']
            });
          }

          // get comp bases
          const componentBasesInDb = yield graphqlClient.query({
            query: ComponentBasesQuery,
            variables: {
              producerIds: producerIds,
              componentBase: componentBase
            },
            fetchPolicy: 'network-only'
          });

          const producerIdToComponentBaseIdMap = {};

          componentBasesInDb.data.allProductComponentBases.nodes.forEach(
            cb => (producerIdToComponentBaseIdMap[cb.producerId] = cb.id)
          );

          // Add Product ComponentBase Products Relationship
          yield all(
            productsToAddComponentBase.map(product => {
              const productComponentBaseProduct = {
                productId: product.id,
                productComponentBaseId:
                  producerIdToComponentBaseIdMap[product.producerId]
              };
              return graphqlClient.mutate({
                mutation: CreateProductComponentBaseProductMutation,
                variables: {
                  productComponentBaseProduct
                },
                refetchQueries: ['FilteredProductsQuery']
              });
            })
          );

          yield put(
            appToastAdd({
              durationMilliseconds: 4000,
              title: 'Product Tagged Successfully',
              message: `${
                productsToAddComponentBase.length
              } Products tagged with "${componentBase}"`,
              toastKey: `toast_${Date.now()}`
            })
          );
        }

        const productsToAddComponentOther = componentOther
          ? selectedProducts.filter(
              p =>
                p.componentOthers.nodes.find(
                  cb => cb.componentOther.name.toLowerCase() === componentOther
                ) === undefined
            )
          : [];

        if (productsToAddComponentOther.length > 0) {
          // unique producerIds
          const producerIds = uniq(
            productsToAddComponentOther.map(p => p.producerId)
          );

          if (isNewComponentOther) {
            yield graphqlClient.mutate({
              mutation: CreateProductComponentOtherMutation,
              variables: {
                productComponentOther: {
                  name: componentOther,
                  producerId: producerIds[0]
                }
              },
              refetchQueries: ['AllProductComponentOthersQuery']
            });
          }

          // get comp others
          const componentOthersInDb = yield graphqlClient.query({
            query: ComponentOthersQuery,
            variables: {
              producerIds: producerIds,
              componentOther: componentOther
            },
            fetchPolicy: 'network-only'
          });

          const producerIdToComponentOtherIdMap = {};

          componentOthersInDb.data.allProductComponentOthers.nodes.forEach(
            cb => (producerIdToComponentOtherIdMap[cb.producerId] = cb.id)
          );

          // Add Product ComponentOther Products Relationship
          yield all(
            productsToAddComponentOther.map(product => {
              const productComponentOtherProduct = {
                productId: product.id,
                productComponentOtherId:
                  producerIdToComponentOtherIdMap[product.producerId]
              };
              return graphqlClient.mutate({
                mutation: CreateProductComponentOtherProductMutation,
                variables: {
                  productComponentOtherProduct
                },
                refetchQueries: ['FilteredProductsQuery']
              });
            })
          );

          yield put(
            appToastAdd({
              durationMilliseconds: 4000,
              title: 'Product Tagged Successfully',
              message: `${
                productsToAddComponentOther.length
              } Products tagged with "${componentOther}"`,
              toastKey: `toast_${Date.now()}`
            })
          );
        }

        const productsToAddCategory = category
          ? selectedProducts.filter(p => !p.productCategory)
          : [];

        if (productsToAddCategory.length > 0) {
          const producerIds = uniq(
            productsToAddCategory.map(p => p.producerId)
          );

          if (isNewCategory) {
            yield graphqlClient.mutate({
              mutation: CreateProductCategoryMutation,
              variables: {
                productCategory: {
                  name: category,
                  producerId: producerIds[0]
                }
              },
              refetchQueries: ['AllProductCategoriesQuery']
            });
          }

          // get categories
          const categoriesInDb = yield graphqlClient.query({
            query: CategoriesQuery,
            variables: {
              producerIds: producerIds,
              category: category
            },
            fetchPolicy: 'network-only'
          });

          const producerIdToCategoryIdMap = {};

          categoriesInDb.data.allProductCategories.nodes.forEach(
            c => (producerIdToCategoryIdMap[c.producerId] = c.id)
          );

          // Add Product ComponentOther Products Relationship
          yield all(
            productsToAddCategory.map(product => {
              return graphqlClient.mutate({
                mutation: UpdateProductByIdMutation,
                variables: {
                  id: product.id,
                  productPatch: {
                    categoryId: producerIdToCategoryIdMap[product.producerId]
                  }
                },
                refetchQueries: ['FilteredProductsQuery']
              });
            })
          );

          yield put(
            appToastAdd({
              durationMilliseconds: 4000,
              title: 'Product Tagged Successfully',
              message: `${
                productsToAddCategory.length
              } Products tagged with "${category}"`,
              toastKey: `toast_${Date.now()}`
            })
          );
        }
      }
      yield put(change(PRODUCT_FILTER_FORM, 'selectedProducts', []));
      yield put(stopSubmit(PRODUCT_FEATURE_TAG_FORM));
    } catch (error) {
      yield put(stopSubmit(PRODUCT_FEATURE_TAG_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to tag products',
          description: error.message
        })
      );
    }
  }
}

export function* productFilterFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === PRODUCT_FILTER_FORM
    );
    yield put(startSubmit(PRODUCT_FILTER_FORM));

    const values = yield select(getFormValues(PRODUCT_FILTER_FORM));

    try {
      const viewerUserId = yield select(selectViewerUserId);
      const workspaceProducerId = yield select(selectWorkspaceProducerId);

      const isConfirm = yield call(confirmationSaga, {
        title: 'Save Product List',
        message: values.productFilterCriterionId
          ? `Do you want to save these products as a new version of the current filter?`
          : `Do you want to save the filter and these products?`
      });

      if (!isConfirm) {
        return;
      }

      const filter = {
        ingredients: values.ingredients && {
          like: `%${values.ingredients}%`
        },
        country:
          values.country && values.country.length > 0
            ? {
                in: labelObjectsToValue(getIncludedValues(values.country)),
                notIn: labelObjectsToValue(getExcludedValues(values.country))
              }
            : undefined,
        countryOfPurchase:
          values.countryOfPurchase && values.countryOfPurchase.length > 0
            ? {
                in: labelObjectsToValue(
                  getIncludedValues(values.countryOfPurchase)
                ),
                notIn: labelObjectsToValue(
                  getExcludedValues(values.countryOfPurchase)
                )
              }
            : undefined,
        producerId:
          values.workspaces && values.workspaces.length > 0
            ? {
                in: labelObjectsToValue(getIncludedValues(values.workspaces)),
                notIn: labelObjectsToValue(getExcludedValues(values.workspaces))
              }
            : undefined,
        physicalState:
          values.physicalState && values.physicalState.length > 0
            ? {
                in: labelObjectsToValue(
                  getIncludedValues(values.physicalState)
                ),
                notIn: labelObjectsToValue(
                  getExcludedValues(values.physicalState)
                )
              }
            : undefined,
        productCategoryByCategoryId:
          values.categories && values.categories.length > 0
            ? {
                name: {
                  in: labelObjectsToValue(getIncludedValues(values.categories)),
                  notIn: labelObjectsToValue(
                    getExcludedValues(values.categories)
                  )
                }
              }
            : undefined,
        productFeatureProductsByProductId:
          values.features && values.features.length > 0
            ? {
                some: getIncludedValues(values.features)
                  ? {
                      productFeatureByProductFeatureId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.features)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.features)
                  ? {
                      productFeatureByProductFeatureId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.features)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined,
        productComponentBaseProductsByProductId:
          values.componentBases && values.componentBases.length > 0
            ? {
                some: getIncludedValues(values.componentBases)
                  ? {
                      productComponentBaseByProductComponentBaseId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.componentBases)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.componentBases)
                  ? {
                      productComponentBaseByProductComponentBaseId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.componentBases)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined,
        productComponentOtherProductsByProductId:
          values.componentOthers && values.componentOthers.length > 0
            ? {
                some: getIncludedValues(values.componentOthers)
                  ? {
                      productComponentOtherByProductComponentOtherId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.componentOthers)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.componentOthers)
                  ? {
                      productComponentOtherByProductComponentOtherId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.componentOthers)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined
      };

      const productsResult = yield graphqlClient.query({
        query: FilteredProductsQuery,
        variables: {
          filter: !isEmpty(filter) ? filter : undefined
        }
      });

      var productFilterCriterionId =
        values.searchFilter && values.searchFilter.value.id;

      // Create Filter
      if (!productFilterCriterionId) {
        const payload = {
          productSearchText: values.productSearchText,
          producerIds:
            values.workspaces &&
            labelObjectsToCsvWithNegative(values.workspaces),
          physicalState:
            values.physicalState &&
            labelObjectsToCsvWithNegative(values.physicalState),
          ingredients: values.ingredients,
          countryOfOrigin:
            values.country && labelObjectsToCsvWithNegative(values.country),
          countryOfPurchase:
            values.countryOfPurchase &&
            labelObjectsToCsvWithNegative(values.countryOfPurchase),
          productCategories:
            values.categories &&
            labelObjectsToCsvWithNegative(values.categories),
          productFeatures:
            values.features && labelObjectsToCsvWithNegative(values.features),
          productComponentBase:
            values.componentBases &&
            labelObjectsToCsvWithNegative(values.componentBases),
          productComponentOther:
            values.componentOthers &&
            labelObjectsToCsvWithNegative(values.componentOthers),
          userId: viewerUserId,
          producerId: workspaceProducerId
        };

        const productFilterCriterion = yield graphqlClient.mutate({
          mutation: CreateProductFilterCriterionMutation,
          variables: {
            productFilterCriterion: payload
          }
        });

        productFilterCriterionId =
          productFilterCriterion.data.createProductFilterCriterion
            .productFilterCriterion.id;
      }

      yield graphqlClient.mutate({
        mutation: CreateProductFilterVersionMutation,
        variables: {
          productFilterVersion: {
            productIds: productsResult.data.products.nodes
              .map(p => p.id)
              .join(','),
            productFilterCriteriaId: productFilterCriterionId,
            producerId: workspaceProducerId,
            versionNo: values.searchFilter
              ? values.searchFilter.value.versions.totalCount + 1
              : 1
          }
        }
      });

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          title: 'Filter Saved Successfully',
          toastKey: `toast_${Date.now()}`
        })
      );

      yield put(stopSubmit(PRODUCT_FILTER_FORM));
      // Destroy the form so that it is re-rendered after the below route change
      // yield put(destroy(PRODUCT_FILTER_FORM));
    } catch (error) {
      yield put(stopSubmit(PRODUCT_FILTER_FORM, error));

      yield put(
        errorAction({
          error,
          title: 'Unable to save filter',
          description: error.message
        })
      );
    }
  }
}
