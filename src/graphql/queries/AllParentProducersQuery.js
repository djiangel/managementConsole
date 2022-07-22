import gql from 'graphql-tag';

export default gql`
  query AllParentProducersQuery(
    $orderBy: [ParentProducersOrderBy!]
    $condition: ParentProducerCondition
  ) {
    parentProducers: allParentProducers(
      orderBy: $orderBy
      condition: $condition
    ) {
      nodes {
        id
        parentProducerId
        groupName
      }
    }
  }
`;
