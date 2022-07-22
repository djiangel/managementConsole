import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductFeatureProductMutation($productFeatureProductId: Int!) {
    deleteProductFeatureProductById(input: { id: $productFeatureProductId }) {
      productFeatureByProductFeatureId {
        id
      }
    }
  }
`;
