import gql from 'graphql-tag';

export default gql`
  query ProducerIdBySlugQuery($slug: String!) {
    producer: producerBySlug(slug: $slug) {
      id
    }
  }
`;
