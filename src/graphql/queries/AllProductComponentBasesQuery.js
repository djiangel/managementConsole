import gql from 'graphql-tag';

export default gql`
  query AllProductComponentBasesQuery(
    $orderBy: [ProductComponentBasesOrderBy!]
    $condition: ProductComponentBaseCondition!
    $filter: ProductComponentBaseFilter
  ) {
    productComponentBases: allProductComponentBases(
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
