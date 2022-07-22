import gql from 'graphql-tag';

export default gql`
  mutation CreateReferenceFlavorWithExistingFlavorMutation(
    $producerId: Int!
    $existingFlavorId: Int
  ) {
    createReferenceFlavorFunction(
      input: { producerId: $producerId, existingFlavorId: $existingFlavorId }
    ) {
      integer
    }
  }
`;
