import gql from 'graphql-tag';

export default gql`
  mutation CreateProductFeatureMutation($productFeature: ProductFeatureInput!) {
    createProductFeature(input: { productFeature: $productFeature }) {
      productFeature {
        id
        producerId
      }
    }
  }
`;
