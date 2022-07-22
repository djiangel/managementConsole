import gql from 'graphql-tag';

export default gql`
  query FlavorStructureByReportId($reportID: UUID!) {
    allRpFlavorStructures(condition: {reportId: $reportID} ) {
      nodes {
        productByProductId {
          name
        }
        leaf
        midpoint
        label
        height
        members
        node
        parentNode
        edgeColor
      }
    }
  }
`