import gql from 'graphql-tag';

export default gql`
  query UploadTest($id: Int!) {
    getPerson(id: $id) {
      name
    }
  }
`;
