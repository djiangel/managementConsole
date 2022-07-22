import gql from 'graphql-tag';

export default gql`
  mutation DeletePanelTagMutation($panelTagId: Int!) {
    deletePanelTagById(input: { id: $panelTagId }) {
      tagByTagId {
        id
      }
    }
  }
`;
