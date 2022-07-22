import gql from 'graphql-tag';

export default gql`
  query AllProductImagesQuery($condition: ProductImageCondition!) {
    productImages: allProductImages(condition: $condition) {
      nodes {
        productId
        url
      }
    }
  }
`;
