import gql from 'graphql-tag';

export default gql`
  mutation CreateProductComponentOtherProductMutation(
    $productComponentOtherProduct: ProductComponentOtherProductInput!
  ) {
    createProductComponentOtherProduct(
      input: { productComponentOtherProduct: $productComponentOtherProduct }
    ) {
      productComponentOtherProduct {
        id
      }
    }
  }
`;
