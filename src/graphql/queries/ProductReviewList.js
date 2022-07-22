import gql from 'graphql-tag';

export default gql`
  query ProductReviewListQuery(
    $batchIdentifier: String
    $panelId: Int
    $producerId: Int!
    $productId: Int
    $userId: Int
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
  ) {
    productReviews: allProductReviews(
      condition: {
        batchIdentifier: $batchIdentifier
        panelId: $panelId
        producerId: $producerId
        productId: $productId
        userId: $userId
      }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id

        product: productByProductId {
          id
          name
        }

        user: userByUserId {
          username
          name
        }

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

        createdAt
        updatedAt
      }
    }
  }
`;
