import gql from 'graphql-tag';

export default gql`
  query AllProductComponentOthersQuery(
    $orderBy: [ProductComponentOthersOrderBy!]
    $condition: ProductComponentOtherCondition!
    $filter: ProductComponentOtherFilter
  ) {
    productComponentOthers: allProductComponentOthers(
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
