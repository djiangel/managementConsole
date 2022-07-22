import gql from 'graphql-tag';

export default gql`
  mutation CreatePanelMutation($panel: PanelInput!) {
    createPanel(input: { panel: $panel }) {
      panel {
        id
      }
    }
  }
`;
