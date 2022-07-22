import gql from 'graphql-tag';

export default gql`
  mutation CreateProductMutation($product: ProductInput!) {
    createProduct(input: { product: $product }) {
      product {
        id
        name
      }
    }
  }
`;
