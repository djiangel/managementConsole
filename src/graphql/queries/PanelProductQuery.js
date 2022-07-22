import gql from 'graphql-tag';
export default gql`
  query PanelProductQuery($panelId: Int, $productId: Int) {
    panelProducts: allPanelProducts(
      condition: { panelId: $panelId, productId: $productId }
    ) {
      nodes {
        id
        panelId
        productId
        blindLabel
      }
      totalCount
    }
  }
`;
