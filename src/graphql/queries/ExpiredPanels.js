import gql from 'graphql-tag';

export default gql`
  query ExpiredPanelsQuery(
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
    $producerId: Int!
  ) {
    producer: producerById(id: $producerId) {
      id

      panels: expiredPanels(
        after: $after
        before: $before
        first: $first
        last: $last
        offset: $offset
      ) {
        nodes {
          id
          pin
          name
          blind
          texture
          startTime
          endTime
          timeLimitSeconds

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

              product: productByProductId {
                id
                name
                prototype
              }

              productReviews {
                totalCount
                nodes {
                  id
                  dataQuality: dataQualityByReviewId {
                    allGgVar
                    ggVarMax
                    insufficientGgVar
                    noRefFlavor
                    excessiveRefFlavor
                    shortReviewTime
                    buttonMashing
                  }
                }
              }
            }
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

        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;
