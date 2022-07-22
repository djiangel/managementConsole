import gql from 'graphql-tag';

export default gql`
  mutation UpdatePanel($id: Int!, $panelPatch: PanelPatch!) {
    updatePanelById(input: { id: $id, panelPatch: $panelPatch }) {
      panel {
        id
        endTime
      }
    }
  }
`;
