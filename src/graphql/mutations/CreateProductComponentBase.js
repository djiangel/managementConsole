import gql from 'graphql-tag';

export default gql`
  mutation CreateProductComponentBaseMutation(
    $productComponentBase: ProductComponentBaseInput!
  ) {
    createProductComponentBase(
      input: { productComponentBase: $productComponentBase }
    ) {
      productComponentBase {
        id
      }
    }
  }
`;
