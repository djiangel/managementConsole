import gql from 'graphql-tag';

export default gql`
  mutation CreateProductCategoryMutation(
    $productCategory: ProductCategoryInput!
  ) {
    createProductCategory(input: { productCategory: $productCategory }) {
      productCategory {
        id
      }
    }
  }
`;
