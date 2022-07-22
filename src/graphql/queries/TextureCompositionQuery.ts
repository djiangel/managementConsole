import gql from 'graphql-tag';

export default gql`
  query TextureCompositionByReportId($reportID: UUID!) {
    allRpTextureCompPrefs(condition: {reportId: $reportID} ) {
      nodes {
        clusterIdx
        composition
        preference
        productByProductId {
          name
        }
      }
    }
  }
`