import gql from 'graphql-tag';

export default gql`
  mutation CreatePanelTagMutation($panelTag: PanelTagInput!) {
    createPanelTag(input: { panelTag: $panelTag }) {
      panelTag {
        id
      }
    }
  }
`;
