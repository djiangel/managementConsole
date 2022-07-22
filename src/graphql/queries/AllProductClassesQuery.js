import gql from 'graphql-tag';

export default gql`
  query AllProductClassesQuery(
    $orderBy: [ProductClassesOrderBy!]
    $condition: ProductClassCondition!
  ) {
    productClasses: allProductClasses(
      orderBy: $orderBy
      condition: $condition
    ) {
      nodes {
        id
        name
      }
    }
  }
`;
