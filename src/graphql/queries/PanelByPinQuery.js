import gql from 'graphql-tag';

export default gql`
  query PanelByPinQuery($pin: String!) {
    panels: allPanels(condition: { pin: $pin }) {
      nodes {
        id
        pin
        name
      }
      totalCount
    }
  }
`;
