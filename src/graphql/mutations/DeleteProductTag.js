import gql from 'graphql-tag';

export default gql`
  mutation DeleteProductTagMutation($productTagId: Int!) {
    deleteProductTagById(input: { id: $productTagId }) {
      tagByTagId {
        id
      }
    }
  }
`;
