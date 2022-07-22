import gql from 'graphql-tag';

export default gql`
  query ProductByIdQuery($id: Int!) {
    product: productById(id: $id) {
      id
      producerId
      name
      localName
      defaultAttributes
      ingredients
      oldProductClass: productClass
      dietaryRestrictions
      country
      countryOfPurchase
      brand
      aroma
      public
      servingVessel
      physicalState
      nutritionalInformation
      productAttributes
      createdAt
      updatedAt
      prototype
      folderId
      hasTextureComponents
      textureComponents
      allowCustomTextureComponents

      panelProduct: panelProductsByProductId {
        nodes {
          panel: panelByPanelId {
            id
            pin
          }
          expirationDate
          productionDate
        }
      }

      batchStates: batchStatesByProductId {
        totalCount
      }

      productReviews: productReviewsByProductId {
        totalCount
      }

      productStyle: productStyleByProductStyleId {
        name
      }

      productCategory: productCategoryByCategoryId {
        id
        name
      }

      productFeatures: productFeatureProductsByProductId {
        nodes {
          id
          productFeatureByProductFeatureId {
            id
            name
          }
        }
      }

      productComponentBases: productComponentBaseProductsByProductId {
        nodes {
          id
          productComponentBaseByProductComponentBaseId {
            id
            name
          }
        }
      }

      productComponentOthers: productComponentOtherProductsByProductId {
        nodes {
          id
          productComponentOtherByProductComponentOtherId {
            id
            name
          }
        }
      }

      productImages: productImagesByProductId {
        nodes {
          id
          url
        }
      }

      nutritionalInfoImages: productNutritionalInfoImagesByProductId {
        nodes {
          id
          url
        }
      }

      selectedProductQuestions: selectedProductQuestionsByProductId {
        nodes {
          id
          question: questionByQuestionId {
            id
            slug
          }
        }
      }
    }
  }
`;
