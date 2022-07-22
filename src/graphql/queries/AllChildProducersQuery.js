import gql from 'graphql-tag';

export default gql`
  query AllChildProducersQuery(
    $orderBy: [ChildProducersOrderBy!]
    $condition: ChildProducerCondition
  ) {
    childProducers: allChildProducers(
      orderBy: $orderBy
      condition: $condition
    ) {
      nodes {
        groupId
        childProducerId
      }
    }
  }
`;
