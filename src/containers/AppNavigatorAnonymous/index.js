import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AUTHENTICATION } from '../../constants/routePaths';
import AuthenticationContainer from '../Authentication';
import { StyledContainerDiv } from './StyledComponents';

const renderAnonymousRoutes = () => (
  <Switch>
    <Route path={AUTHENTICATION} component={AuthenticationContainer} />

    <Route render={() => <Redirect to={AUTHENTICATION} />} />
  </Switch>
);

const AppNavigatorAnonymousContainer = () => (
  <StyledContainerDiv>{renderAnonymousRoutes()}</StyledContainerDiv>
);

AppNavigatorAnonymousContainer.displayName = 'AppNavigatorAnonymousContainer';

export default AppNavigatorAnonymousContainer;
