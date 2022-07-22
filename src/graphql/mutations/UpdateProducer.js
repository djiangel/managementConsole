import gql from 'graphql-tag';

export default gql`
  mutation updateProducer($id: Int!, $producerPatch: ProducerPatch!) {
    updateProducerById(input: { id: $id, producerPatch: $producerPatch }) {
      producer {
        id
      }
    }
  }
`;
