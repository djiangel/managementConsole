import gql from 'graphql-tag';

export default gql`
  mutation CreateProductComponentOtherMutation(
    $productComponentOther: ProductComponentOtherInput!
  ) {
    createProductComponentOther(
      input: { productComponentOther: $productComponentOther }
    ) {
      productComponentOther {
        id
      }
    }
  }
`;
