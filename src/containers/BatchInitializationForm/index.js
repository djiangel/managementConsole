import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import BatchInitializationForm from './batchInitializationForm';

const ProducerProductsQuery = gql`
  query ProducerProductsQuery($slug: String!) {
    producer: producerBySlug(slug: $slug) {
      products: productsByProducerId(orderBy: NAME_ASC) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

export default graphql(ProducerProductsQuery, {
  options: ({ producerSlug }) => ({
    variables: {
      slug: producerSlug
    }
  }),
  props: ({ data: { loading, producer } }) => ({
    loading,
    productOptions:
      producer &&
      producer.products &&
      producer.products.nodes &&
      producer.products.nodes.map(({ name, id }) => ({
        label: name,
        value: id
      }))
  })
})(BatchInitializationForm);
