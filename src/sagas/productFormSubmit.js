/* eslint-disable no-constant-condition */
import { all, put, select, take } from 'redux-saga/effects';
import { get } from 'lodash';
import { destroy, getFormValues, startSubmit, stopSubmit } from 'redux-form';
import { push as pushRoute } from 'react-router-redux';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { PRODUCT_FORM } from '../constants/formNames';
import { PRODUCT } from '../constants/routePaths';
import graphqlClient from '../consumers/graphqlClient';
import CreateProductMutation from '../graphql/mutations/CreateProduct';
import UpdateProductMutation from '../graphql/mutations/UpdateProduct';
import CreateProductFeatureMutation from '../graphql/mutations/CreateProductFeature';
import CreateProductFeatureProductMutation from '../graphql/mutations/CreateProductFeatureProduct';
import CreateProductCategoryMutation from '../graphql/mutations/CreateProductCategory';
import CreateProductComponentBaseMutation from '../graphql/mutations/CreateProductComponentBase';
import CreateProductComponentBaseProductMutation from '../graphql/mutations/CreateProductComponentBaseProduct';
import CreateProductComponentOtherMutation from '../graphql/mutations/CreateProductComponentOther';
import CreateProductComponentOtherProductMutation from '../graphql/mutations/CreateProductComponentOtherProduct';
import UploadProductImageMutation from '../graphql/mutations/UploadProductImage';
import CreatePanelProductMutation from '../graphql/mutations/CreatePanelProduct';
import CreateSelectedProductQuestion from '../graphql/mutations/CreateSelectedProductQuestion';
import PanelQuery from '../graphql/queries/Panel';
import ProductsQuery from '../graphql/queries/ProductsQuery';
import AllProductImagesQuery from '../graphql/queries/AllProductImagesQuery';
import AvailablePanelsQuery from '../graphql/queries/AvailablePanels';
import selectViewerUserId from '../selectors/viewerUserId';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import formatPath from '../utils/formatPath';
import { labelObjectsToCsv, labelObjectsToValue } from '../utils/sagaHelper';
import UploadProductNutritionalInfoImage from '../graphql/mutations/UploadProductNutritionalInfoImage';
import { exception } from 'react-ga';

export default function* productFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) => type === FORM_SUBMIT && payload === PRODUCT_FORM
    );

    yield put(startSubmit(PRODUCT_FORM));

    const addProductFormValues = yield select(getFormValues(PRODUCT_FORM));
    const viewerUserId = yield select(selectViewerUserId);
    const workspaceProducerId = yield select(selectWorkspaceProducerId);
    const productClasses = addProductFormValues.productClass;
    const productTags = addProductFormValues.productTag;
    const productComponentBases = addProductFormValues.productComponentBase;
    const productComponentOthers = addProductFormValues.productComponentOther;
    const productFeatures = addProductFormValues.productFeature;
    const productCategory = addProductFormValues.productCategory;
    const productImages = addProductFormValues.images;
    const nutritionalInfoImages = addProductFormValues.nutritionalInfoImages;
    const panels = addProductFormValues.addToPanel;
    const questions = addProductFormValues.questions;

    let dietaryRestrictions = [];
    addProductFormValues.allergens &&
      (dietaryRestrictions = dietaryRestrictions.concat(
        addProductFormValues.allergens
      ));
    addProductFormValues.certifiedSafe &&
      (dietaryRestrictions = dietaryRestrictions.concat(
        addProductFormValues.certifiedSafe
      ));

    if (addProductFormValues.nutritionalInfo) {
      // Format nutritional info
      Object.keys(addProductFormValues.nutritionalInfo).forEach(
        (key, index) => {
          if (!key.includes('_unit') && key !== 'additional') {
            let value = addProductFormValues.nutritionalInfo[key];
            let unit = addProductFormValues.nutritionalInfo[key + '_unit'];
            if (unit.value && unit.value !== 'None')
              addProductFormValues.nutritionalInfo[key] = `${value} ${
                unit.value
              }`;
          }
        }
      );

      // Delete units from nutritional info
      Object.keys(addProductFormValues.nutritionalInfo).forEach(
        (key, index) => {
          if (key.includes('_unit')) {
            delete addProductFormValues.nutritionalInfo[key];
          }
        }
      );

      // Format Additional Nutritional Info
      if (addProductFormValues.nutritionalInfo.additional) {
        addProductFormValues.nutritionalInfo.additional = addProductFormValues.nutritionalInfo.additional.map(
          att => {
            att.value = `${att.value} ${att.unit}`;
            delete att['unit'];
            return att;
          }
        );
      }
    }

    // const undefinedTotalArray = Array.from(
    //   { length: addProductFormValues.undefinedComponentTotal.value },
    //   (v, k) => k + 1
    // );
    // var undefinedComponentNames = undefinedTotalArray.map(
    //   idx => 'Component ' + idx
    // );

    // var definedComponentNames =
    //   addProductFormValues.definedComponentNames &&
    //   addProductFormValues.definedComponentNames.component &&
    //   addProductFormValues.definedComponentNames.component.map(
    //     data => data.value
    //   );

    const product = {
      name: get(addProductFormValues, 'name').trim(),
      localName:
        addProductFormValues.localName && addProductFormValues.localName.trim(),
      brand: get(addProductFormValues, 'brand').trim(),
      ingredients: get(addProductFormValues, 'ingredients', '').trim(),
      dietaryRestrictions:
        (addProductFormValues.allergens ||
          addProductFormValues.certifiedSafe) &&
        labelObjectsToCsv(dietaryRestrictions),
      servingVessel:
        addProductFormValues.servingVessel &&
        labelObjectsToCsv(addProductFormValues.servingVessel),
      physicalState:
        addProductFormValues.physicalState &&
        labelObjectsToCsv(
          addProductFormValues.physicalState.map(
            item =>
              item.value === 'Others'
                ? {
                    value:
                      'Others: ' +
                      addProductFormValues.custom_physicalState.input
                  }
                : item
          )
        ),
      country: addProductFormValues.country
        ? addProductFormValues.country.value
        : null,
      countryOfPurchase: addProductFormValues.countryOfPurchase
        ? addProductFormValues.countryOfPurchase.value
        : null,
      defaultAttributes:
        addProductFormValues.productClassAttribute &&
        labelObjectsToValue(addProductFormValues.productClassAttribute),
      productAttributes: addProductFormValues.productAttributes,
      nutritionalInformation: addProductFormValues.nutritionalInfo,
      producerId: workspaceProducerId,
      userId: viewerUserId,
      public: addProductFormValues.public,
      prototype: addProductFormValues.prototype,
      aroma: addProductFormValues.aroma,
      folderId: addProductFormValues.folder
      // hasTextureComponents: addProductFormValues.texture,
      // textureComponents: addProductFormValues.texture
      //   ? {
      //       defined:
      //         addProductFormValues.definedComponents === 'true' ? true : false,
      //       label:
      //         definedComponentNames && definedComponentNames.length
      //           ? definedComponentNames
      //           : undefinedComponentNames
      //     }
      //   : null,
      // allowCustomTextureComponents:
      //   addProductFormValues.allowCustomTextureComponents
    };
    let productId = null;

    try {
      // Add product...
      const addProductMutationResult = yield graphqlClient.mutate({
        mutation: CreateProductMutation,
        variables: {
          product
        }
        // refetchQueries: [
        //   {
        //     query: ProductsQuery,
        //     variables: {
        //       condition: {
        //         producerId: workspaceProducerId
        //       }
        //     }
        //   },
        //   {
        //     query: AllProductImagesQuery,
        //     variables: {
        //       condition: {
        //         producerId: workspaceProducerId
        //       }
        //     }
        //   }
        // ]
      });

      productId =
        addProductMutationResult &&
        addProductMutationResult.data &&
        addProductMutationResult.data.createProduct &&
        addProductMutationResult.data.createProduct.product &&
        addProductMutationResult.data.createProduct.product.id;

      if (productCategory && productCategory.length > 0) {
        // Create new features
        if (isNaN(productCategory[0].id)) {
          const newProductCategory = {
            name: productCategory[0].id,
            producerId: workspaceProducerId
          };

          const addNewProductCategoryResult = yield graphqlClient.mutate({
            mutation: CreateProductCategoryMutation,
            variables: {
              newProductCategory
            }
          });

          var categoryId =
            addNewProductCategoryResult.data.createProductCategory
              .productCategory.id;
        } else {
          var categoryId = Number(productCategory[0].id);
        }

        yield graphqlClient.mutate({
          mutation: UpdateProductMutation,
          variables: {
            id: productId,
            productPatch: {
              categoryId
            }
          }
        });
      }

      if (productFeatures) {
        // Create new features
        const newProductFeatures = productFeatures.filter(tag => isNaN(tag.id));
        const addNewProductFeatureResults = yield all(
          newProductFeatures.map(newProductFeature => {
            const productFeature = {
              name: newProductFeature.id,
              producerId: workspaceProducerId
            };

            return graphqlClient.mutate({
              mutation: CreateProductFeatureMutation,
              variables: {
                productFeature
              }
            });
          })
        );

        const newProductFeatureIds =
          addNewProductFeatureResults &&
          addNewProductFeatureResults.map(
            result => result.data.createProductFeature.productFeature.id
          );

        // Get all product feature IDs
        const productFeatureIds = newProductFeatureIds.concat(
          productFeatures
            .filter(feature => !isNaN(feature.id))
            .map(feature => Number(feature.id))
        );

        // Add Product Feature Products Relationship
        yield all(
          productFeatureIds.map(productFeatureId => {
            const productFeatureProduct = {
              productId: productId,
              productFeatureId: productFeatureId
            };
            return graphqlClient.mutate({
              mutation: CreateProductFeatureProductMutation,
              variables: {
                productFeatureProduct
              }
            });
          })
        );
      }

      if (productComponentBases) {
        // Create new component base
        const newProductComponentBases = productComponentBases.filter(tag =>
          isNaN(tag.id)
        );
        const addNewProductComponentBaseResults = yield all(
          newProductComponentBases.map(newProductComponentBase => {
            const productComponentBase = {
              name: newProductComponentBase.id,
              producerId: workspaceProducerId
            };

            return graphqlClient.mutate({
              mutation: CreateProductComponentBaseMutation,
              variables: {
                productComponentBase
              }
            });
          })
        );

        const newProductComponentBaseIds =
          addNewProductComponentBaseResults &&
          addNewProductComponentBaseResults.map(
            result =>
              result.data.createProductComponentBase.productComponentBase.id
          );

        // Get all product component base IDs
        const productComponentBaseIds = newProductComponentBaseIds.concat(
          productComponentBases
            .filter(comp => !isNaN(comp.id))
            .map(comp => Number(comp.id))
        );

        // Add Product Component Base Products Relationship
        yield all(
          productComponentBaseIds.map(productComponentBaseId => {
            const productComponentBaseProduct = {
              productId: productId,
              productComponentBaseId: productComponentBaseId
            };
            return graphqlClient.mutate({
              mutation: CreateProductComponentBaseProductMutation,
              variables: {
                productComponentBaseProduct
              }
            });
          })
        );
      }

      if (productComponentOthers) {
        // Create new component others
        const newProductComponentOthers = productComponentOthers.filter(tag =>
          isNaN(tag.id)
        );
        const addNewProductComponentOtherResults = yield all(
          newProductComponentOthers.map(newProductComponentOther => {
            const productComponentOther = {
              name: newProductComponentOther.id,
              producerId: workspaceProducerId
            };

            return graphqlClient.mutate({
              mutation: CreateProductComponentOtherMutation,
              variables: {
                productComponentOther
              }
            });
          })
        );

        const newProductComponentOtherIds =
          addNewProductComponentOtherResults &&
          addNewProductComponentOtherResults.map(
            result =>
              result.data.createProductComponentOther.productComponentOther.id
          );

        // Get all product component others IDs
        const productComponentOtherIds = newProductComponentOtherIds.concat(
          productComponentOthers
            .filter(comp => !isNaN(comp.id))
            .map(comp => Number(comp.id))
        );

        // Add Product component others Products Relationship
        yield all(
          productComponentOtherIds.map(productComponentOtherId => {
            const productComponentOtherProduct = {
              productId: productId,
              productComponentOtherId: productComponentOtherId
            };
            return graphqlClient.mutate({
              mutation: CreateProductComponentOtherProductMutation,
              variables: {
                productComponentOtherProduct
              }
            });
          })
        );
      }

      // Add Product Image
      if (productImages && productImages.toBeAdded.length) {
        yield all(
          productImages.toBeAdded.map(file => {
            const image = {
              blob: file.getFileEncodeBase64String(),
              productId: productId,
              producerId: workspaceProducerId
            };

            return graphqlClient.mutate({
              mutation: UploadProductImageMutation,
              variables: {
                image
              }
            });
          })
        );
      }

      if (nutritionalInfoImages && nutritionalInfoImages.toBeAdded.length) {
        yield all(
          nutritionalInfoImages.toBeAdded.map(file => {
            const image = {
              blob: file.getFileEncodeBase64String(),
              productId: productId,
              producerId: workspaceProducerId
            };

            return graphqlClient.mutate({
              mutation: UploadProductNutritionalInfoImage,
              variables: {
                image
              }
            });
          })
        );
      }

      if (panels) {
        // Obtains available panel data
        const panelQueryResults = yield all(
          panels.map(panel =>
            graphqlClient.query({
              query: PanelQuery,
              variables: {
                panelId: panel.value
              }
            })
          )
        );
        const panelResults = panelQueryResults.map(
          result => result.data.panel.products.totalCount
        );

        // Add product to PanelProduct of each panel
        yield all(
          panels.map((panel, index) =>
            graphqlClient.mutate({
              mutation: CreatePanelProductMutation,
              variables: {
                panelProduct: {
                  panelId: panel.value,
                  productId: productId,
                  order: panelResults[index] + 1
                }
              },
              refetchQueries: [
                {
                  query: AvailablePanelsQuery,
                  variables: {
                    producerId: workspaceProducerId
                  }
                }
              ]
            })
          )
        );
      }

      if (questions && questions.length > 0) {
        yield all(
          questions.map(questionId =>
            graphqlClient.mutate({
              mutation: CreateSelectedProductQuestion,
              variables: {
                selectedProductQuestion: {
                  productId: productId,
                  questionId: parseInt(questionId)
                }
              }
            })
          )
        );
      }

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(PRODUCT_FORM));

      yield put(
        pushRoute(
          formatPath(PRODUCT, {
            productId
          })
        )
      );

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(PRODUCT_FORM));
    } catch (error) {
      yield put(stopSubmit(PRODUCT_FORM, error));

      // If product has already been created, force redirect to the product page
      if (productId) {
        yield put(
          pushRoute(
            formatPath(PRODUCT, {
              productId
            })
          )
        );
        yield put(destroy(PRODUCT_FORM));
      }

      yield put(
        errorAction({
          error,
          title: productId
            ? 'Product Created with Errors'
            : 'Failed to Create Product',
          description: error.message
        })
      );

      exception({
        description: `${
          productId ? 'Product Created with Errors' : 'Failed to Create Product'
        } - ${error.message}`,
        fatal: false
      });
    }
  }
}
