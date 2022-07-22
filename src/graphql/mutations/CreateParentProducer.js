import gql from 'graphql-tag';

export default gql`
  mutation CreateParentProducerMutation($parentProducer: ParentProducerInput!) {
    createParentProducer(input: { parentProducer: $parentProducer }) {
      parentProducer {
        parentProducerId
        groupName
      }
    }
  }
`;
