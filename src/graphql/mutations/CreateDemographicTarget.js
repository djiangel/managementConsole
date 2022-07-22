import gql from 'graphql-tag';

export default gql`
  mutation CreateDemographicTargetMutation(
    $demographicTarget: DemographicTargetInput!
  ) {
    createDemographicTarget(input: { demographicTarget: $demographicTarget }) {
      demographicTarget {
        id
      }
    }
  }
`;
