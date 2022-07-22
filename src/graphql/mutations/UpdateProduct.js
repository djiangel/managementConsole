import gql from 'graphql-tag';

export default gql`
  mutation UpdateProduct($id: Int!, $productPatch: ProductPatch!) {
    updateProductById(input: { id: $id, productPatch: $productPatch }) {
      product {
        id
      }
    }
  }
`;
