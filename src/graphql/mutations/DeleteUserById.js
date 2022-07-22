import gql from 'graphql-tag';

export default gql`
  mutation DeleteUserById($id: Int!) {
    deleteUserById(input: { id: $id }) {
      deletedUserId
    }
  }
`;
