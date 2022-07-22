import gql from 'graphql-tag';

export default gql`
  mutation UpdateBlindLabelPanelProductId(
    $input: UpdatePanelProductByIdInput!
  ) {
    updatePanelProductById(input: $input) {
      panelProduct {
        id
        blindLabel
      }
    }
  }
`;
