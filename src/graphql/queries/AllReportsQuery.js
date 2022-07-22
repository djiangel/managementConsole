import gql from 'graphql-tag';

export default gql`
  query AllReportsQuery(
    $condition: ReportJobCondition
    $first: Int
    $orderBy: [ReportJobsOrderBy!]
    $filter: ReportJobFilter
  ) {
    reports: allReportJobs(
      condition: $condition
      orderBy: $orderBy
      first: $first
      filter: $filter
    ) {
      nodes {
        id
        jobId
        parentJobId
        projectName
        reportType
        targetGroupName
        requestedThrough
        startedAt
        reportStatus
        reportId
        pdfEfsUri
        clientName
        passedQa
      }
    }
  }
`;
