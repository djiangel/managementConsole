import gql from 'graphql-tag';

export default gql`
  query PanelByIdQuery($panelId: Int!) {
    panel: panelById(id: $panelId) {
      id
      name
      pin
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
      
      products: panelProductsByPanelId {
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
`