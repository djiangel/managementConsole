import gql from 'graphql-tag';

export default gql`
  mutation UpdateDemographicTarget($id: Int!, $patch: DemographicTargetPatch!) {
    updateDemographicTargetById(
      input: { demographicTargetPatch: $patch, id: $id }
    ) {
      demographicTarget {
        id
      }
    }
  }
`;
