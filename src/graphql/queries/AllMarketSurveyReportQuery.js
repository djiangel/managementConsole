import gql from 'graphql-tag';

export default gql`
  query AllMarketSurveyReportQuery(
    $condition: MarketSurveyReportCondition
    $first: Int
    $orderBy: [MarketSurveyReportsOrderBy!]
    $filter: MarketSurveyReportFilter
  ) {
    reports: allMarketSurveyReports(
      condition: $condition
      orderBy: $orderBy
      first: $first
      filter: $filter
    ) {
      nodes {
        id
        user: userByUserId {
          name
        }
        projectName
        status
        submittedOn
        pdfLink
        demographic
        client
        rootId
        versionNo
      }
    }
  }
`;
