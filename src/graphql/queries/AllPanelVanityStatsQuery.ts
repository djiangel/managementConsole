import gql from 'graphql-tag';

export default gql`
  query PanelVanityStatsQuery(
    $producerId: Int!
    $skipPanelInfo: Boolean! = true
    $filter: PanelFilter
  ) {
    allPanels(condition: { producerId: $producerId }, filter: $filter) {
      totalCount

      nodes @skip(if: $skipPanelInfo) {
        products: panelProductsByPanelId {
          totalCount
        }
        reviews: productReviewsByPanelId {
          totalCount
        }
      }
    }
  }
`;
