import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ProductReview from './productReview';

const ProductReviewQuery = gql`
  query ProductQuery($id: Int!) {
    productReview: productReviewById(id: $id) {
      id
      userId
      productClass
      productId

      startTime
      endTime

      perceivedQuality

      astringent
      bitter
      coldFinish
      dairy
      dry
      earthy
      floral
      fruits
      gamey
      herbaceous
      marine
      meaty
      mineral
      mouthfeel
      nutsAndSeeds
      retronasal
      rich
      roasted
      smoked
      sourAndAcidity
      spices
      sugar
      wet
      woody

      attributes
      referenceFlavors

      productNotes
      userNotes

      averageAcceleration
      averageLux
      averagePressure
      averageTemperatureFahrenheit
      averageVolume
      establishment
      isBlindReview
      latitude
      longitude
      standardDeviationAcceleration
      standardDeviationLux
      standardDeviationPressure
      standardDeviationTemperatureFahrenheit
      standardDeviationVolume
      userGraphMovement
      userQuadrantMovement
      isSignificant
      reviewerExperience
      reviewerProductClassProductReviewNumber
      reviewWeight
      createdAt
      updatedAt
    }
  }
`;

export default graphql(ProductReviewQuery, {
  options: ({ match }) => ({
    variables: {
      id: match.params.reviewId
    }
  }),
  props: ({ data: { loading, productReview } }) => ({
    loading,
    productReview
  })
})(ProductReview);
