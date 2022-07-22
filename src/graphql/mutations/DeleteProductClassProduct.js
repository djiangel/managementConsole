import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductClassProductMutation($productClassProductId: Int!) {
    deleteProductClassProductById(input: { id: $productClassProductId }) {
      productClassByProductClassId {
        id
      }
    }
  }
`;
