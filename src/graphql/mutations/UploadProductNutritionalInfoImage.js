import gql from 'graphql-tag';

export default gql`
  mutation UploadProductNutritionalInfoImage(
    $image: UploadProductNutritionalInfoImageInput!
  ) {
    uploadProductNutritionalInfoImage(input: $image) {
      id
      url
    }
  }
`;
