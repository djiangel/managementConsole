import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductComponentOtherProductMutation(
    $productComponentOtherProductId: Int!
  ) {
    deleteProductComponentOtherProductById(
      input: { id: $productComponentOtherProductId }
    ) {
      productComponentOtherByProductComponentOtherId {
        id
      }
    }
  }
`;
