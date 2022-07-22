import gql from 'graphql-tag';

export default gql`
  query AllWorkspaceGroup($workspaceId: Int!) {
    allParentProducers(condition: {parentProducerId: $workspaceId}) {
      nodes {
        id
        groupName
      }
      totalCount
    }
  }
`;
