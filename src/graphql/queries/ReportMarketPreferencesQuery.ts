import gql from 'graphql-tag';

export default gql`
query ReportMarketPreferencesQuery($reportID: UUID!) {
    allRpMarketPreferences(condition: {reportId: $reportID} ) {
      nodes {
        product: productByProductId {
          id
          name
        }
        pqRating
        percentPop
      }
    }
  }
  `