import gql from 'graphql-tag';

export default gql`
  query PanelQuery($panelId: Int!) {
    panel: panelById(id: $panelId) {
      id
      pin
      name
      blind
      texture
      startTime
      endTime
      timeLimitSeconds
      public
      hideReviews

      averageReviewDurationSeconds
      totalReviewDurationSeconds

      panelists {
        nodes {
          id
          name
        }
      }

      products: panelProductsByPanelId(orderBy: ORDER_ASC) {
        nodes {
          id
          attributes
          blindLabel
          servingVessel
          clientName
          projectName
          totalCost
          expirationDate
          productionDate

          product: productByProductId {
            id
            name
            public
            productClass
            productClasses: productClassProductsByProductId {
              nodes {
                id
                productClassByProductClassId {
                  id
                  name
                }
              }
            }
            selectedProductQuestions: selectedProductQuestionsByProductId {
              totalCount
            }
            producer: producerByProducerId {
              name
            }
          }

          productReviews {
            totalCount
          }

          selectedPanelProductQuestions: selectedPanelProductQuestionsByPanelProductId {
            totalCount
          }
        }
        totalCount
      }

      tags: panelTagsByPanelId {
        nodes {
          id

          tag: tagByTagId {
            id
            tag
          }
        }
      }

      productReviews: productReviewsByPanelId {
        totalCount
      }
    }
  }
`;
