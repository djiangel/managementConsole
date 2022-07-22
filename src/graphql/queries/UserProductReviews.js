import gql from 'graphql-tag';

export default gql`
  query UserProductReviewsQuery(
    $username: String!
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
  ) {
    user: userByUsername(username: $username) {
      productReviews: productReviewsByUserId(
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
          productClass
          productId

          product: productByProductId {
            id
            name

            producer: producerByProducerId {
              slug
              name
            }
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
  }
`;
