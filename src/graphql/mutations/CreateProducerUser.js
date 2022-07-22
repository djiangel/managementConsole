import gql from 'graphql-tag';

export default gql`
  mutation CreateProducerUserMutation($producerUser: ProducerUserInput!) {
    createProducerUser(input: { producerUser: $producerUser }) {
      producerUser {
        id
      }
    }
  }
`;
