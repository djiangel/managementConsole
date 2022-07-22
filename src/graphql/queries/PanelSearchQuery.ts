import gql from 'graphql-tag';

export default gql`
  query PanelSearchQuery($query: String, $first: Int, $startTime: Datetime, $endTime: Datetime, $producerId: Int) {
    panelResults: searchPanels(
      query: $query
      first: $first
      _startTime: $startTime
      _endTime: $endTime
      _producerId: $producerId
    ){
      nodes{
        id

        panel: panelByPanelId{
          id
          name
          pin
          startTime
        }

        product: productByProductId{
          id
          name
          brand
        }
      }
      totalCount
    }
  }
`