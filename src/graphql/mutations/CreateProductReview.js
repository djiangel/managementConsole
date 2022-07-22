import gql from 'graphql-tag';

export default gql`
  mutation CreateProductReviewMutation($productReview: ProductReviewInput!) {
    createProductReview(input: { productReview: $productReview }) {
      productReview {
        id
        __typename
        endTime
        perceivedQuality
        producer: producerByProducerId {
          id
          name
        }
        product: productByProductId {
          id
          name
        }
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
        referenceFlavors
        productNotes
        userNotes
        userId
        productId
        panelId
      }
    }
  }
`;
