import gql from 'graphql-tag';

export default gql`
  query AllProductCategoriesQuery(
    $orderBy: [ProductCategoriesOrderBy!]
    $condition: ProductCategoryCondition!
    $filter: ProductCategoryFilter
  ) {
    productCategories: allProductCategories(
      orderBy: $orderBy
      condition: $condition
      filter: $filter
    ) {
      nodes {
        id
        name
      }
    }
  }
`;
