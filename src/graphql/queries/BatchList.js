import gql from 'graphql-tag';

export default gql`
  query BatchListQuery(
    $producerId: Int!
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
  ) {
    producer: producerById(id: $producerId) {
      batches: batchStatesByProducerId(
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
          productId
          product: productByProductId {
            name
          }
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
