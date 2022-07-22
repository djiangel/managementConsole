import gql from 'graphql-tag';

export default gql`
  mutation CreateProductClassMutation($productClass: ProductClassInput!) {
    createProductClass(input: { productClass: $productClass }) {
      productClass {
        id
      }
    }
  }
`;
