import gql from 'graphql-tag';

export default gql`
  query ProducerByIdQuery($id: Int!) {
    producer: producerById(id: $id) {
      id
      name
      allowBehavioralQuestions
      defaultTimezone
    }
  }
`;
