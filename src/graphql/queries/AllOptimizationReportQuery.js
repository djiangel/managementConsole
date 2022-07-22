import gql from 'graphql-tag';

export default gql`
  query AllOptimizationReportQuery(
    $condition: OptimizationReportCondition
    $first: Int
    $orderBy: [OptimizationReportsOrderBy!]
    $filter: OptimizationReportFilter
  ) {
    reports: allOptimizationReports(
      condition: $condition
      orderBy: $orderBy
      first: $first
      filter: $filter
    ) {
      nodes {
        id
        user: userByUserId {
          name
        }
        projectName
        status
        submittedOn
        pdfLink
        demographic
        client
        rootId
        versionNo
      }
    }
  }
`;
