import gql from 'graphql-tag';

const ProductGroupSearchQuery = gql`
  query SearchProductsInGroup(
    $query: String
    $producerId: Int!
    $groupId: Int!
    $first: Int
    $offset: Int
  ) {
    productResults: searchProductsInGroup(
      query: $query
      producerId: $producerId
      groupId: $groupId
      first: $first
      offset: $offset
    ) {
      pageInfo {
        hasNextPage
      }
      nodes {
        id
        name
        brand
        public
        aroma
        producer: producerByProducerId {
          id
          name
        }
        createdAt
        productReviews: productReviewsByProductId(
          orderBy: END_TIME_DESC
          first: 1
        ) {
          totalCount
          nodes {
            createdAt
          }
        }
        panels: panelProductsByProductId {
          nodes {
            panelInfo: panelByPanelId {
              id
              startTime
              name
              pin
            }
          }
        }
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
        defaultAttributes
        selectedProductQuestions: selectedProductQuestionsByProductId {
          totalCount
        }
        category: productCategoryByCategoryId {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export default ProductGroupSearchQuery
