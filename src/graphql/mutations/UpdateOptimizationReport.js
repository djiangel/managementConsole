import gql from 'graphql-tag';

export default gql`
  mutation UpdateOptimizationReport(
    $id: Int!
    $patch: OptimizationReportPatch!
  ) {
    updateOptimizationReportById(
      input: { optimizationReportPatch: $patch, id: $id }
    ) {
      optimizationReport {
        id
      }
    }
  }
`;
