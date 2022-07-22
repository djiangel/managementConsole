import gql from 'graphql-tag';

export default gql`
  query ReportSummaryByReportId($reportID: UUID!) {
    allReportJobs(condition: {reportId: $reportID} ) {
      nodes {
        id
        reportId
        jobId
        startedAt
        reportStatus
        reportSummariesByReportId {
          edges {
            node {
              productByProductId {
                id
                name
              },
              pq
              pComp
              polarization
            }
          }
        }
      }
    }
  }
`