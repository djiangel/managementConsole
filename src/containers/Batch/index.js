import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Batch from './batch';

const BatchOverviewQuery = gql`
  query BatchOverviewQuery($batchIdentifier: String!) {
    batchStates: allBatchStates(
      condition: { batchIdentifier: $batchIdentifier }
    ) {
      nodes {
        id

        batchIdentifier
        notes
        attributes
        createdAt
        updatedAt

        product: productByProductId {
          id
          name
        }

        reportBatchFlawDetections: reportBatchFlawDetectionsByBatchStateId {
          totalCount
        }
        reportObjectiveFlavorProfiles: reportObjectiveFlavorProfilesByBatchStateId {
          totalCount
        }
        reportBatchDeviationDetections: reportBatchDeviationDetectionsByBatchStateId {
          totalCount
        }
        reportFlavorAttributeIntensities: reportFlavorAttributeIntensitiesByBatchStateId {
          totalCount
        }
        reportProductReferenceFlavorEffects: reportProductReferenceFlavorEffectsByBatchStateId {
          totalCount
        }
        reportProductReferenceFlavorIntensityEffects: reportProductReferenceFlavorIntensityEffectsByBatchStateId {
          totalCount
        }
        reportFlavorAttributeIntensityDeviationDetections: reportFlavorAttributeIntensityDeviationDetectionsByBatchStateId {
          totalCount
        }
      }

      totalCount
    }
  }
`;

export default graphql(BatchOverviewQuery, {
  options: ({ match }) => ({
    variables: {
      batchIdentifier: match.params.batchSlug
    }
  }),
  props: ({ data: { loading, batchStates } }) => ({
    loading,
    batchStates
  })
})(Batch);
