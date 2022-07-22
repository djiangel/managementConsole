import gql from 'graphql-tag';

export default gql`
  query UserListQuery(
    $producerId: Int!
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
  ) {
    producer: producerById(id: $producerId) {
      id
      producerUsers: producerUsersByProducerId(
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
          user: userByUserId {
            email
            username
            name
            phoneNumber
            dateOfBirth
            defaultProductReviewEstablishment
            ethnicity
            firstLanguage
            gender
            race
            smoke
            role
            lastActive
            productReviews: productReviewsByUserId(orderBy: [CREATED_AT_DESC]) {
              totalCount
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;
