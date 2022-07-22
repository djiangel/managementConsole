import gql from 'graphql-tag';

export default gql`
  mutation CreateOptimizationReportMutation(
    $optimizationReport: OptimizationReportInput!
  ) {
    createOptimizationReport(
      input: { optimizationReport: $optimizationReport }
    ) {
      report: optimizationReport {
        id
      }
    }
  }
`;
