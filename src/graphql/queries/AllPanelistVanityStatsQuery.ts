import gql from 'graphql-tag';

export default gql`
  query PanelistVanityStatsQuery($workspaceId: Int!, $filter: UserFilter) {
    allPanelists(workspaceId: $workspaceId, filter: $filter) {
      totalCount
    }
  }
`;
