import gql from 'graphql-tag';

export default gql`
  mutation MergeProductReviewsByUser($newUserId: Int!, $oldUserId: Int!) {
    updated: mergeProductReviewsByAccount(
      input: { oldUserId: $oldUserId, newUserId: $newUserId }
    ) {
      productReviews {
        id
      }
    }
  }
`;
