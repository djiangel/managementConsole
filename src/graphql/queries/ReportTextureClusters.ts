import gql from 'graphql-tag';

export default gql`
  query TextureClustersByReportId($reportID: UUID!) {
    allRpTextureClusters(condition: {reportId: $reportID} ) {
      nodes {
        clusterIdx, texture, confidence
      }
    }
  }
`