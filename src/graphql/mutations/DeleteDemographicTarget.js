import gql from 'graphql-tag';

export default gql`
  mutation DeleteDemographicTarget($id: Int!) {
    deleteDemographicTargetById(input: { id: $id }) {
      deletedDemographicTargetId
    }
  }
`;
