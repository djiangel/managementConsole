import gql from 'graphql-tag';

export default gql`
  mutation CreateFolderMutation($folder: FolderInput!) {
    createFolder(input: { folder: $folder }) {
      folder {
        id
      }
    }
  }
`;
