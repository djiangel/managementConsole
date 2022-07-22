import gql from 'graphql-tag';

export default gql`
  query AllPanelistsQuery(
    $workspaceId: Int!
    $recentDate: Datetime!
    $filter: UserFilter
    $first: Int
    $last: Int
    $offset: Int
    $after: Cursor
    $before: Cursor
    $orderBy: [UsersOrderBy!]
  ) {
    panelists: allPanelists(
      workspaceId: $workspaceId
      filter: $filter
      first: $first
      last: $last
      offset: $offset
      after: $after
      before: $before
      orderBy: $orderBy
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          username
          email
          phoneNumber
          interfaceLanguage
          ethnicity
          lastActive
          productReviews: productReviewsByUserId(
            filter: {
              panelByPanelId: { producerId: { equalTo: $workspaceId } }
            }
          ) {
            totalCount
            nodes {
              id
              dataQuality: dataQualityByReviewId {
                allGgVar
                ggVarMax
                insufficientGgVar
                noRefFlavor
                excessiveRefFlavor
                shortReviewTime
                buttonMashing
                timeTaken
              }
            }
          }
          recentReviews: productReviewsByUserId(
            filter: { startTime: { greaterThanOrEqualTo: $recentDate } }
          ) {
            totalCount
            nodes {
              id
              dataQuality: dataQualityByReviewId {
                allGgVar
                ggVarMax
                insufficientGgVar
                noRefFlavor
                excessiveRefFlavor
                shortReviewTime
                buttonMashing
                timeTaken
              }
            }
          }
        }
      }
    }
  }
`;
