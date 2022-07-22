import gql from 'graphql-tag';

export default gql`
  query DemographicTargetByIdQuery($id: Int!) {
    demographicTarget: demographicTargetById(id: $id) {
      id
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
  }
`;
