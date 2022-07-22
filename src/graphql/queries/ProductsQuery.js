import gql from 'graphql-tag';

export default gql`
  query ProductsQuery(
    $orderBy: [ProductsOrderBy!]
    $panelOrderBy: [PanelProductsOrderBy!]
    $condition: ProductCondition!
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
  ) {
    products: allProducts(
      orderBy: $orderBy
      condition: $condition
      first: $first
      last: $last
      after: $after
      before: $before
      offset: $offset
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        product: node {
          id
          name
          brand
          createdAt
          folderId
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
          panelProducts: panelProductsByProductId(orderBy: $panelOrderBy) {
            nodes {
              panel: panelByPanelId {
                pin
              }
            }
          }
          productCategory: productCategoryByCategoryId {
            id
            name
          }
        }
        cursor
      }
    }
  }
`;
