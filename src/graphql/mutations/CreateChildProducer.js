import gql from 'graphql-tag';

export default gql`
  mutation CreateChildProducerMutation($childProducer: ChildProducerInput!) {
    createChildProducer(input: { childProducer: $childProducer }) {
      childProducer {
        groupId
        childProducerId
      }
    }
  }
`;
