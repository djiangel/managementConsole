import gql from 'graphql-tag';

export default gql`
  mutation CreateMarketSurveyReportMutation(
    $marketSurveyReport: MarketSurveyReportInput!
  ) {
    createMarketSurveyReport(
      input: { marketSurveyReport: $marketSurveyReport }
    ) {
      report: marketSurveyReport {
        id
      }
    }
  }
`;
