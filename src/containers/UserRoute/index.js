import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from 'react-router-dom';
import LoadingWrapper from '../../components/LoadingWrapper';

const UserRouteQuery = gql`
  query UserRouteQuery($username: String!) {
    user: userByUsername(username: $username) {
      id
    }
  }
`;

type UserRouteProps = {
  component: ?(props: Object) => ?React$Element,
  render: ?(props: Object) => ?React$Element
};

const UserRoute = ({ component, render, ...props }: UserRouteProps) => {
  const RouteComponent = render || component;
  const RouteContainer = graphql(UserRouteQuery, {
    options: ({ match }) => ({
      variables: {
        username: match.params.username
      }
    }),
    props: ({ data: { loading, user } }) => ({
      loading,
      userId: user && user.id
    })
  })(routeComponentProps => (
    <LoadingWrapper {...routeComponentProps} Component={RouteComponent} />
  ));

  return <Route {...props} component={RouteContainer} />;
};

UserRoute.displayName = 'UserRoute';

export default UserRoute;
