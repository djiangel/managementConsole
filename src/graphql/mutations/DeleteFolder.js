import gql from 'graphql-tag';

export default gql`
  mutation DeleteFolder($id: Int!) {
    deleteFolderById(input: { id: $id }) {
      deletedFolderId
    }
  }
`;
