import gql from 'graphql-tag';

const UserSearchInWorkspaceQuery = gql`
  query UserSearchInWorkspaceQuery($query: String, $producerId: Int) {
    user: searchUsersInWorkspace(query: $query, _producerId: $producerId) {
      nodes {
        id
        username
        email
        phoneNumber
        firstLanguage
        race
        productReviews: productReviewsByUserId {
          totalCount
        }
      }
      totalCount
    }
  }
`;

export default UserSearchInWorkspaceQuery;
