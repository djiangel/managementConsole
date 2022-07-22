import gql from 'graphql-tag';

export default gql`
  mutation UpdateMarketSurveyReport(
    $id: Int!
    $patch: MarketSurveyReportPatch!
  ) {
    updateMarketSurveyReportById(
      input: { marketSurveyReportPatch: $patch, id: $id }
    ) {
      marketSurveyReport {
        id
      }
    }
  }
`;
