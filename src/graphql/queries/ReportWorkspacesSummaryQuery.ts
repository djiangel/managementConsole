import gql from 'graphql-tag';

export default gql`
  query WorkspaceSumary($reportID: UUID!){
    allRpWorkspaceSummaries(condition: {reportId: $reportID}) {
      nodes {
        branch
        reviewsConsidered
        reviewsAnalyzed
        signaturesConsidered
        signaturesAnalyzed
      }
    }
  }
`