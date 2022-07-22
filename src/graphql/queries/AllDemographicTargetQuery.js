import gql from 'graphql-tag';

export default gql`
  query AllDemographicTargetQuery(
    $condition: DemographicTargetCondition
    $first: Int
    $orderBy: [DemographicTargetsOrderBy!]
    $filter: DemographicTargetFilter
  ) {
    demographicTargets: allDemographicTargets(
      condition: $condition
      orderBy: $orderBy
      first: $first
      filter: $filter
    ) {
      nodes {
        id
        producerId
        name
        countries
        ages
        ethnicities
        genders
        smokingHabits
        regionTarget
        socioEcon
        createdAt
        updatedAt

        user: userByUserId {
          id
          username
        }
      }
      totalCount
    }
  }
`;
