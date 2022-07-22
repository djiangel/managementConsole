import gql from 'graphql-tag';

export default gql`
  query FoldersQuery($condition: FolderCondition!) {
    folders: allFolders(condition: $condition) {
      nodes {
        id
        name
        parentId
      }
    }
  }
`;
