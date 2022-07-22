import gql from 'graphql-tag';

export default gql`
  mutation CreateReportQaMutation($reportQa: ReportQaInput!) {
    createReportQa(input: { reportQa: $reportQa }) {
      report: reportQa {
        id
      }
    }
  }
`;
