import gql from 'graphql-tag';

export default gql`
  query UserByEmailQuery($email: String!) {
    user: userByEmail(email: $email) {
      id
    }
  }
`;
