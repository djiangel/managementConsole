import gql from 'graphql-tag';

export default gql`
  mutation UpdateProductReview(
    $id: Int!
    $productReviewPatch: ProductReviewPatch!
  ) {
    updated: updateProductReviewById(
      input: { id: $id, productReviewPatch: $productReviewPatch }
    ) {
      productReview {
        id
        userId
        productId
      }
    }
  }
`;
