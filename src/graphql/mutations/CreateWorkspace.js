import gql from 'graphql-tag';

export default gql`
  mutation CreateWorkspace($workspace: ProducerInput!) {
    createProducer(input: { producer: $workspace }) {
      producer {
        id
        name
      }
    }
  }
`;
