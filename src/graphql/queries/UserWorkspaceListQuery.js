import gql from 'graphql-tag';

export default gql`
  query UserWorkspaceListQuery($email: String!) {
    user: userByEmail(email: $email) {
      producerUsersByUserId {
        nodes {
          producer: producerByProducerId {
            id
            name
          }
        }
        totalCount
      }
    }
  }
`;
