import gql from 'graphql-tag';

export default gql`
  query AvailablePanelsQuery(
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
    $producerId: Int!
  ) {
    producer: producerById(id: $producerId) {
      id

      panels: availablePanels(
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
              servingVessel
              clientName
              projectName
              totalCost
              expirationDate
              productionDate

              product: productByProductId {
                id
                name
                prototype
              }

              productReviews {
                totalCount
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
      }
    }
  }
`;
