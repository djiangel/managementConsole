import gql from 'graphql-tag';

export default gql`
  mutation UpdateUser($id: Int!, $userPatch: UserPatch!) {
    updateUserById(input: { id: $id, userPatch: $userPatch }) {
      user {
        id
      }
    }
  }
`;
