import gql from 'graphql-tag';

export default gql`
  mutation MapReferenceFlavorMutation(
    $producerId: Int!
    $flavorAttribute: FlavorAttributeT
    $value: String
    $label: String
    $language: String
  ) {
    mapReferenceFlavorFunction(
      input: {
        producerId: $producerId
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
