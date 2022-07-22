import gql from 'graphql-tag';

export default gql`
  query UserDemographicList(
    $first: Int
    $after: Cursor
    $last: Int
    $before: Cursor
    $orderBy: [UsersOrderBy!]
    $filter: UserFilter
  ) {
    allUsers(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
      filter: $filter
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        username
        email
        name
        phoneNumber
        dateOfBirth
        ethnicity
        firstLanguage
        gender
        race
        smoke
        hometown
        country
        nationalIdentity
        dietaryRestrictions
        province
        city
        educationalAttainment
      }
      totalCount
    }
  }
`;