import gql from 'graphql-tag';

export default gql`
  query ProductNamesByFolderQuery($folderId: Int!) {
    allProducts(condition: { folderId: $folderId }) {
      nodes {
        id
        name
      }
    }
  }
`;
