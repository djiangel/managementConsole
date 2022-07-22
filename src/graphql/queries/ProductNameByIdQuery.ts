import gql from 'graphql-tag';

export default gql`
query ProductNameByIdQuery($id: Int!){
  product: productById(id: $id) {
    id
    name
  }
}
`;