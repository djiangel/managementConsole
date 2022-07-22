import gql from 'graphql-tag';

export default gql`
  query ViewerQuery {
    viewer {
      id
      email
      name
      role
      username

      workspaceProducers {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;
