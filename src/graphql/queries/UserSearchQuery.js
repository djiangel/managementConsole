import gql from 'graphql-tag';

const UserSearchQuery = gql`
  query UserSearchQuery($query: String) {
    user: searchUsers(query: $query) {
      nodes {
        id
        username
        email
        phoneNumber
      }
    }
  }
`;

export default UserSearchQuery;
