import gql from 'graphql-tag';

export default gql`
  mutation CreateReferenceFlavorMutation(
    $producerId: Int!
    $flavorAttribute: FlavorAttributeT
    $value: String
    $label: String
    $language: String
  ) {
    createReferenceFlavorFunction(
      input: {
        producerId: $producerId
        existingFlavorId: 0
        flavorAttribute: $flavorAttribute
        value: $value
        label: $label
        language: $language
      }
    ) {
      integer
    }
  }
`;
