import gql from 'graphql-tag';

export default gql`
  mutation UpdateFolder($id: Int!, $folderPatch: FolderPatch!) {
    updateFolderById(input: { id: $id, folderPatch: $folderPatch }) {
      folder {
        id
      }
    }
  }
`;
