import gql from 'graphql-tag';

export default gql`
  query LatestAppBuildHistory($date: Datetime!) {
    allAppBuildHistories(
      orderBy: CREATED_AT_DESC
      first: 1
      filter: { createdAt: { lessThanOrEqualTo: $date } }
    ) {
      nodes {
        build
        createdAt
      }
    }
  }
`;
