import gql from 'graphql-tag';

export default gql`
  query PairedPreferencesByReportId($reportID: UUID!) {
    allRpPairedPreferences(condition: {reportId: $reportID} ) {
      nodes {
        productByProductId1 {
          name
        },
        productByProductId2 {
          name
        },
        percentPreference,
      }
    }
  }
`