import gql from 'graphql-tag';

export default gql`
  mutation CreateProductComponentBaseProductMutation(
    $productComponentBaseProduct: ProductComponentBaseProductInput!
  ) {
    createProductComponentBaseProduct(
      input: { productComponentBaseProduct: $productComponentBaseProduct }
    ) {
      productComponentBaseProduct {
        id
      }
    }
  }
`;
