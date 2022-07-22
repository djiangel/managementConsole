import gql from 'graphql-tag';

export default gql`
  mutation CreateProductFeatureProductMutation(
    $productFeatureProduct: ProductFeatureProductInput!
  ) {
    createProductFeatureProduct(
      input: { productFeatureProduct: $productFeatureProduct }
    ) {
      productFeatureProduct {
        id
      }
    }
  }
`;
