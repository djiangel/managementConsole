import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductNutritionalInfoImageMutation(
    $nutritionalInfoImageId: Int!
  ) {
    deleteProductNutritionalInfoImageById(
      input: { id: $nutritionalInfoImageId }
    ) {
      productNutritionalInfoImage {
        id
      }
    }
  }
`;
