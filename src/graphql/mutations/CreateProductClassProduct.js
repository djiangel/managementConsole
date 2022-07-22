import gql from 'graphql-tag';

export default gql`
  mutation CreateProductClassProductMutation(
    $productClassProduct: ProductClassProductInput!
  ) {
    createProductClassProduct(
      input: { productClassProduct: $productClassProduct }
    ) {
      productClassProduct {
        id
      }
    }
  }
`;
