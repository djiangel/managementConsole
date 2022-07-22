import graphqlClient from '../consumers/graphqlClient';
import { startSubmit, stopSubmit, getFormValues } from 'redux-form';
import { all, select, put } from 'redux-saga/effects';
import * as _ from 'lodash';
import errorAction from '../actions/error';
import { EDIT_PRODUCT_FORM } from '../constants/formNames';
import UpdateProductMutation from '../graphql/mutations/UpdateProduct';
import {
  labelObjectsToCsv,
  labelObjectsToValue,
  tagComparator
} from '../utils/sagaHelper';
import ProductByIdQuery from '../graphql/queries/ProductByIdQuery';
import AvailablePanelsQuery from '../graphql/queries/AvailablePanels';
import AllProductImagesQuery from '../graphql/queries/AllProductImagesQuery';
import CreateProductFeatureMutation from '../graphql/mutations/CreateProductFeature';
import CreateProductFeatureProductMutation from '../graphql/mutations/CreateProductFeatureProduct';
import DeleteProductFeatureProductMutation from '../graphql/mutations/DeleteProductFeatureProduct';
import CreateProductCategoryMutation from '../graphql/mutations/CreateProductCategory';
import CreateProductComponentBaseMutation from '../graphql/mutations/CreateProductComponentBase';
import CreateProductComponentBaseProductMutation from '../graphql/mutations/CreateProductComponentBaseProduct';
import DeleteProductComponentBaseProductMutation from '../graphql/mutations/DeleteProductComponentBaseProduct';
import CreateProductComponentOtherMutation from '../graphql/mutations/CreateProductComponentOther';
import CreateProductComponentOtherProductMutation from '../graphql/mutations/CreateProductComponentOtherProduct';
import DeleteProductComponentOtherProductMutation from '../graphql/mutations/DeleteProductComponentOtherProduct';
import CreateSelectedProductQuestion from '../graphql/mutations/CreateSelectedProductQuestion';
import DeleteSelectedProductQuestion from '../graphql/mutations/DeleteSelectedProductQuestion';
import UploadProductImageMutation from '../graphql/mutations/UploadProductImage';
import DeleteProductImageMutation from '../graphql/mutations/DeleteProductImage';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import DeleteProductNutritionalInfoImage from '../graphql/mutations/DeleteProductNutritionalInfoImage';
import UploadProductNutritionalInfoImage from '../graphql/mutations/UploadProductNutritionalInfoImage';
import { exception } from 'react-ga';

function* editProductFormSubmitSaga() {
  yield put(startSubmit(EDIT_PRODUCT_FORM));

  const editProductFormValues = yield select(getFormValues(EDIT_PRODUCT_FORM));

  const workspaceProducerId = yield select(selectWorkspaceProducerId);

  const productId = editProductFormValues.id;

  const productImage = editProductFormValues.images;
  const nutritionalInfoImage = editProductFormValues.nutritionalInfoImages;

  const productClasses = editProductFormValues.productClass;
  const productClassesBefore = editProductFormValues.productClassBefore;

  const productTags = editProductFormValues.productTag;
  const productTagsBefore = editProductFormValues.productTagBefore;

  const productCategories = editProductFormValues.productCategory;
  const productCategoriesBefore = editProductFormValues.productCategoryBefore;

  const productComponentBases = editProductFormValues.productComponentBase;
  const productComponentBasesBefore =
    editProductFormValues.productComponentBaseBefore;

  const productComponentOthers = editProductFormValues.productComponentOther;
  const productComponentOthersBefore =
    editProductFormValues.productComponentOtherBefore;

  const productFeatures = editProductFormValues.productFeature;
  const productFeaturesBefore = editProductFormValues.productFeatureBefore;

  const productCategoriesToBeAdded = _.differenceWith(
    productCategories,
    productCategoriesBefore,
    tagComparator
  );
  const productCategoriesToBeDeleted = _.differenceWith(
    productCategoriesBefore,
    productCategories,
    tagComparator
  );

  const productComponentBasesToBeAdded = _.differenceWith(
    productComponentBases,
    productComponentBasesBefore,
    tagComparator
  );
  const productComponentBasesToBeDeleted = _.differenceWith(
    productComponentBasesBefore,
    productComponentBases,
    tagComparator
  );

  const productComponentOthersToBeAdded = _.differenceWith(
    productComponentOthers,
    productComponentOthersBefore,
    tagComparator
  );
  const productComponentOthersToBeDeleted = _.differenceWith(
    productComponentOthersBefore,
    productComponentOthers,
    tagComparator
  );

  const productFeaturesToBeAdded = _.differenceWith(
    productFeatures,
    productFeaturesBefore,
    tagComparator
  );
  const productFeaturesToBeDeleted = _.differenceWith(
    productFeaturesBefore,
    productFeatures,
    tagComparator
  );

  const selectedProductQuestions =
    editProductFormValues.selectedProductQuestions;
  const selectedQuestions = editProductFormValues.questions;

  const questionsToBeAdded = _.difference(
    selectedQuestions,
    selectedProductQuestions.map(prodQue => prodQue.question.id)
  );

  const selectedProductQuestionIdsToBeDeleted = selectedProductQuestions
    .filter(prodQue => selectedQuestions.indexOf(prodQue.question.id) < 0)
    .map(prodQue => prodQue.id);

  let dietaryRestrictions = [];
  editProductFormValues.allergens &&
    (dietaryRestrictions = dietaryRestrictions.concat(
      editProductFormValues.allergens
    ));
  editProductFormValues.certifiedSafe &&
    (dietaryRestrictions = dietaryRestrictions.concat(
      editProductFormValues.certifiedSafe
    ));

  if (editProductFormValues.nutritionalInfo) {
    // Format nutritional info
    Object.keys(editProductFormValues.nutritionalInfo).forEach((key, index) => {
      if (!key.includes('_unit') && key !== 'additional') {
        let value = editProductFormValues.nutritionalInfo[key];
        let unit = editProductFormValues.nutritionalInfo[key + '_unit'];
        if (unit.value && unit.value !== 'None')
          editProductFormValues.nutritionalInfo[key] = `${value} ${unit.value}`;
      }
    });

    // Delete units from nutritional info
    Object.keys(editProductFormValues.nutritionalInfo).forEach((key, index) => {
      if (key.includes('_unit')) {
        delete editProductFormValues.nutritionalInfo[key];
      }
    });

    // Format Additional Nutritional Info
    if (editProductFormValues.nutritionalInfo.additional) {
      editProductFormValues.nutritionalInfo.additional = editProductFormValues.nutritionalInfo.additional.map(
        att => {
          att.value = `${att.value} ${att.unit}`;
          delete att['unit'];
          return att;
        }
      );
    }
  }

  // const undefinedTotalArray = Array.from(
  //   { length: editProductFormValues.undefinedComponentTotal.value },
  //   (v, k) => k + 1
  // );
  // var undefinedComponentNames = undefinedTotalArray.map(
  //   idx => 'Component ' + idx
  // );

  // var definedComponentNames =
  //   editProductFormValues.definedComponentNames &&
  //   editProductFormValues.definedComponentNames.component &&
  //   editProductFormValues.definedComponentNames.component.map(
  //     data => data.value
  //   );
  const productPatch = {
    name: editProductFormValues.name && editProductFormValues.name.trim(),
    localName:
      editProductFormValues.localName && editProductFormValues.localName.trim(),
    brand: editProductFormValues.brand && editProductFormValues.brand.trim(),
    ingredients:
      editProductFormValues.ingredients &&
      editProductFormValues.ingredients.trim(),
    public: editProductFormValues.public,
    aroma: editProductFormValues.aroma,
    dietaryRestrictions:
      (editProductFormValues.allergens ||
        editProductFormValues.certifiedSafe) &&
      labelObjectsToCsv(dietaryRestrictions),
    servingVessel:
      editProductFormValues.servingVessel &&
      labelObjectsToCsv(editProductFormValues.servingVessel),
    physicalState:
      editProductFormValues.physicalState &&
      labelObjectsToCsv(
        editProductFormValues.physicalState.map(
          item =>
            item.value === 'Others'
              ? {
                  value:
                    'Others: ' +
                    editProductFormValues.custom_physicalState.input
                }
              : item
        )
      ),
    nutritionalInformation: editProductFormValues.nutritionalInfo,
    country:
      editProductFormValues.country && editProductFormValues.country.value,
    countryOfPurchase:
      editProductFormValues.countryOfPurchase &&
      editProductFormValues.countryOfPurchase.value,
    productAttributes: editProductFormValues.productAttributes,
    defaultAttributes:
      editProductFormValues.productClassAttribute &&
      labelObjectsToValue(editProductFormValues.productClassAttribute),
    prototype: editProductFormValues.prototype,
    folderId: editProductFormValues.folder
    // hasTextureComponents: editProductFormValues.texture,
    // textureComponents: editProductFormValues.texture
    //   ? {
    //       defined:
    //         editProductFormValues.definedComponents === 'true' ? true : false,
    //       label:
    //         definedComponentNames && definedComponentNames.length
    //           ? definedComponentNames
    //           : undefinedComponentNames
    //     }
    //   : null,
    // allowCustomTextureComponents:
    //   editProductFormValues.allowCustomTextureComponents
  };

  try {
    yield graphqlClient.mutate({
      mutation: UpdateProductMutation,
      variables: {
        id: productId,
        productPatch
      },
      refetchQueries: queriesToRefetch(workspaceProducerId, productId)
    });

    // Upload new product images if any were added
    if (productImage.toBeAdded.length) {
      yield all(
        productImage.toBeAdded.map(file => {
          const image = {
            blob: file.getFileEncodeBase64String(),
            productId: productId,
            producerId: workspaceProducerId
          };

          return graphqlClient.mutate({
            mutation: UploadProductImageMutation,
            variables: {
              image
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          });
        })
      );
    }

    // Delete product images if any were removed
    if (productImage.toBeRemoved.length) {
      yield all(
        productImage.toBeRemoved.map(image =>
          graphqlClient.mutate({
            mutation: DeleteProductImageMutation,
            variables: {
              productImageId: image.imageId
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    // Upload new product images if any were added
    if (nutritionalInfoImage.toBeAdded.length) {
      yield all(
        nutritionalInfoImage.toBeAdded.map(file => {
          const image = {
            blob: file.getFileEncodeBase64String(),
            productId: productId,
            producerId: workspaceProducerId
          };

          return graphqlClient.mutate({
            mutation: UploadProductNutritionalInfoImage,
            variables: {
              image
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          });
        })
      );
    }

    // Delete nutritional info images if any were removed
    if (nutritionalInfoImage.toBeRemoved.length) {
      yield all(
        nutritionalInfoImage.toBeRemoved.map(image =>
          graphqlClient.mutate({
            mutation: DeleteProductNutritionalInfoImage,
            variables: {
              nutritionalInfoImageId: image.imageId
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    if (productCategoriesToBeAdded.length) {
      // Create new category if not in DB
      if (isNaN(productCategoriesToBeAdded[0].id)) {
        const newProductCategory = {
          name: productCategoriesToBeAdded[0].id,
          producerId: workspaceProducerId
        };

        const addNewProductCategoryResult = yield graphqlClient.mutate({
          mutation: CreateProductCategoryMutation,
          variables: {
            newProductCategory
          }
        });

        var categoryId =
          addNewProductCategoryResult.data.createProductCategory.productCategory
            .id;
      } else {
        var categoryId = Number(productCategoriesToBeAdded[0].id);
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
    } else if (productCategoriesToBeDeleted.length) {
      yield graphqlClient.mutate({
        mutation: UpdateProductMutation,
        variables: {
          id: productId,
          productPatch: {
            categoryId: null
          }
        }
      });
    }

    // Delete product features if any was removed
    if (productFeaturesToBeDeleted.length) {
      yield all(
        productFeaturesToBeDeleted.map(productFeature =>
          graphqlClient.mutate({
            mutation: DeleteProductFeatureProductMutation,
            variables: {
              productFeatureProductId: productFeature.productFeatureProductId
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    // Add product features if any has been added
    if (productFeaturesToBeAdded.length) {
      // Get new product features that are not in the db
      const newProductFeatures = productFeaturesToBeAdded.filter(
        productFeature => isNaN(productFeature.id)
      );

      // Calls mutation for creating of new product features (to be stored in db)
      const addNewProductFeaturesResult = yield all(
        newProductFeatures.map(newProductFeature => {
          const productFeature = {
            name: newProductFeature.id,
            producerId: workspaceProducerId
          };

          return graphqlClient.mutate({
            mutation: CreateProductFeatureMutation,
            variables: {
              productFeature: productFeature
            }
          });
        })
      );

      // Get new product features' ids
      const newProductFeatureIds =
        addNewProductFeaturesResult &&
        addNewProductFeaturesResult.map(
          ({ data }) => data.createProductFeature.productFeature.id
        );

      // Get all product features' ids
      const productFeatureIds = newProductFeatureIds.concat(
        productFeaturesToBeAdded
          .filter(productFeature => !isNaN(productFeature.id))
          .map(productFeature => Number(productFeature.id))
      );

      // Add Product Feature
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
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          });
        })
      );
    }

    // Delete product componentBases if any was removed
    if (productComponentBasesToBeDeleted.length) {
      yield all(
        productComponentBasesToBeDeleted.map(productComponentBase =>
          graphqlClient.mutate({
            mutation: DeleteProductComponentBaseProductMutation,
            variables: {
              productComponentBaseProductId:
                productComponentBase.productComponentBaseProductId
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    // Add product componentBases if any has been added
    if (productComponentBasesToBeAdded.length) {
      // Get new product componentBases that are not in the db
      const newProductComponentBases = productComponentBasesToBeAdded.filter(
        productComponentBase => isNaN(productComponentBase.id)
      );

      // Calls mutation for creating of new product componentBases (to be stored in db)
      const addNewProductComponentBasesResult = yield all(
        newProductComponentBases.map(newProductComponentBase => {
          const productComponentBase = {
            name: newProductComponentBase.id,
            producerId: workspaceProducerId
          };

          return graphqlClient.mutate({
            mutation: CreateProductComponentBaseMutation,
            variables: {
              productComponentBase: productComponentBase
            }
          });
        })
      );

      // Get new product componentBases' ids
      const newProductComponentBaseIds =
        addNewProductComponentBasesResult &&
        addNewProductComponentBasesResult.map(
          ({ data }) => data.createProductComponentBase.productComponentBase.id
        );

      // Get all product componentBases' ids
      const productComponentBaseIds = newProductComponentBaseIds.concat(
        productComponentBasesToBeAdded
          .filter(productComponentBase => !isNaN(productComponentBase.id))
          .map(productComponentBase => Number(productComponentBase.id))
      );

      // Add Product ComponentBase
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
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          });
        })
      );
    }

    // Delete product componentOthers if any was removed
    if (productComponentOthersToBeDeleted.length) {
      yield all(
        productComponentOthersToBeDeleted.map(productComponentOther =>
          graphqlClient.mutate({
            mutation: DeleteProductComponentOtherProductMutation,
            variables: {
              productComponentOtherProductId:
                productComponentOther.productComponentOtherProductId
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    // Add product componentOthers if any has been added
    if (productComponentOthersToBeAdded.length) {
      // Get new product componentOthers that are not in the db
      const newProductComponentOthers = productComponentOthersToBeAdded.filter(
        productComponentOther => isNaN(productComponentOther.id)
      );

      // Calls mutation for creating of new product componentOthers (to be stored in db)
      const addNewProductComponentOthersResult = yield all(
        newProductComponentOthers.map(newProductComponentOther => {
          const productComponentOther = {
            name: newProductComponentOther.id,
            producerId: workspaceProducerId
          };

          return graphqlClient.mutate({
            mutation: CreateProductComponentOtherMutation,
            variables: {
              productComponentOther: productComponentOther
            }
          });
        })
      );

      // Get new product componentOthers' ids
      const newProductComponentOtherIds =
        addNewProductComponentOthersResult &&
        addNewProductComponentOthersResult.map(
          ({ data }) =>
            data.createProductComponentOther.productComponentOther.id
        );

      // Get all product componentOthers' ids
      const productComponentOtherIds = newProductComponentOtherIds.concat(
        productComponentOthersToBeAdded
          .filter(productComponentOther => !isNaN(productComponentOther.id))
          .map(productComponentOther => Number(productComponentOther.id))
      );

      // Add Product ComponentOther
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
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          });
        })
      );
    }

    // Add selected questions
    if (questionsToBeAdded && questionsToBeAdded.length > 0) {
      yield all(
        questionsToBeAdded.map(questionId =>
          graphqlClient.mutate({
            mutation: CreateSelectedProductQuestion,
            variables: {
              selectedProductQuestion: {
                productId: productId,
                questionId: parseInt(questionId)
              }
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }

    // Delete unselected questions
    if (selectedProductQuestionIdsToBeDeleted.length > 0) {
      yield all(
        selectedProductQuestionIdsToBeDeleted.map(productQuestionId =>
          graphqlClient.mutate({
            mutation: DeleteSelectedProductQuestion,
            variables: {
              selectedProductQuestionId: parseInt(productQuestionId)
            },
            refetchQueries: queriesToRefetch(workspaceProducerId, productId)
          })
        )
      );
    }
  } catch (error) {
    yield put(stopSubmit('EDIT_PRODUCT_FORM'));
    yield put(
      errorAction({
        error,
        title: 'Failed to Edit Product',
        description: error.message
      })
    );

    exception({
      description: `Failed to Edit Product - ${error.message}`,
      fatal: false
    });
  }
}

function queriesToRefetch(workspaceProducerId, productId) {
  return [
    {
      query: ProductByIdQuery,
      variables: {
        id: productId
      }
    },
    {
      query: AvailablePanelsQuery,
      variables: {
        producerId: workspaceProducerId
      }
    },
    {
      query: AllProductImagesQuery,
      variables: {
        condition: {
          producerId: workspaceProducerId
        }
      }
    }
  ];
}

export default editProductFormSubmitSaga;
