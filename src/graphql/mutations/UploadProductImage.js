import gql from 'graphql-tag';

export default gql`
  mutation UploadProductImageMutation($image: UploadProductImageInput!) {
    uploadProductImage(input: $image) {
      id
      url
    }
  }
`;
