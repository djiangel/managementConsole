import gql from 'graphql-tag';

export default gql`
  query ReportTextureCompPrefByReportId($reportID: UUID!) {
    allRpTextureCompPrefs(condition: { reportId: $reportID }) {
      nodes {
        productByProductId {
          id
          name
        }
        clusterIdx
        composition
        preference
      }
    }
  }
`;
