import gql from 'graphql-tag';

export default gql`
  mutation CreatePanelProductMutation($panelProduct: PanelProductInput!) {
    createPanelProduct(input: { panelProduct: $panelProduct }) {
      panelProduct {
        id
      }
    }
  }
`;
