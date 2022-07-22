import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductImageMutation($productImageId: Int!) {
    deleteProductImageById(input: { id: $productImageId }) {
      productImage {
        id
      }
    }
  }
`;
