import gql from 'graphql-tag';

export default gql`
  mutation UpdateReportJob($id: Int!, $reportJobPatch: ReportJobPatch!) {
    updateReportJobById(input: { id: $id, reportJobPatch: $reportJobPatch }) {
      clientMutationId
    }
  }
`;
