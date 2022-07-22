import gql from 'graphql-tag';

export default gql`
  query ProductCategorizationByProductIdsQuery($ids: [Int!]!) {

    allProductCategories(
      filter: { productsByCategoryId: { some: { id: { in: $ids } } } }
    ) {
      nodes {
        id
        name
      }
    }
  }
`;
