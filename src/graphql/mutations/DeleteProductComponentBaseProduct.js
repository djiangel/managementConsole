import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductComponentBaseProductMutation(
    $productComponentBaseProductId: Int!
  ) {
    deleteProductComponentBaseProductById(
      input: { id: $productComponentBaseProductId }
    ) {
      productComponentBaseByProductComponentBaseId {
        id
      }
    }
  }
`;
