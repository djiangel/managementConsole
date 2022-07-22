import gql from 'graphql-tag';

export default gql`
  query AllProductFeaturesQuery(
    $orderBy: [ProductFeaturesOrderBy!]
    $condition: ProductFeatureCondition!
    $filter: ProductFeatureFilter
  ) {
    productFeatures: allProductFeatures(
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
