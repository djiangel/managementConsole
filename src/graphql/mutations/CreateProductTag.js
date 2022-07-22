import gql from 'graphql-tag';

export default gql`
  mutation CreateProductTagMutation($productTag: ProductTagInput!) {
    createProductTag(input: { productTag: $productTag }) {
      productTag {
        id
      }
    }
  }
`;
