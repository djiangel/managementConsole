import gql from 'graphql-tag';

export default gql`
  query AllReportJobsQuery {
    reports: allReportJobs {
      nodes {
        id
        jobId
        startedAt
        reportStatus
      }
    }
  }
`;
