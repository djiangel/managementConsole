import gql from 'graphql-tag';

export default gql`
  mutation DeleteReferenceFlavorMutation(
    $producerId: Int!
    $existingFlavorId: Int!
    $deleted: Boolean!
  ) {
    deleteReferenceFlavorFunction(
      input: {
        producerId: $producerId
        existingFlavorId: $existingFlavorId
        deleted: $deleted
      }
    ) {
      integer
    }
  }
`;
