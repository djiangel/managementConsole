import gql from 'graphql-tag';

export default gql`
  query UserReviewsCount($userId: Int) {
    allProductReviews(condition: { userId: $userId }) {
      totalCount
    }
  }
`;
