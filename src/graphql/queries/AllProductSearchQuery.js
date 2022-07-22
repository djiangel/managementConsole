import gql from 'graphql-tag';

const AllProductSearchQuery = gql`
  query AllProductSearchQuery(
    $query: String
    $first: Int = 5
    $offset: Int = 0
  ) {
    productResults: searchProducts(
      query: $query
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
        productImages: productImagesByProductId {
          totalCount
          nodes {
            url
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

export default AllProductSearchQuery;
