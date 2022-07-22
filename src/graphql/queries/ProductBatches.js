import gql from 'graphql-tag';

export default gql`
  query ProductBatchesQuery(
    $productId: Int!
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
  ) {
    product: productById(id: $productId) {
      batches: batchStatesByProductId(
        first: $first
        after: $after
        last: $last
        before: $before
        orderBy: ID_DESC
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          batchIdentifier
          attributes
          notes
          createdAt
          updatedAt
          sourceBatchStepInvocationId
          sinkBatchStepInvocationId
        }
      }
    }
  }
`;
