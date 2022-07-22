import React, { Component } from 'react';
import { Router } from 'react-router';
import ActivityIndicator from '../../components/ActivityIndicator';
import AppFooter from '../../components/AppFooter';
import routerHistory from '../../constants/routerHistory';
import AppNavigatorAnonymousContainer from '../AppNavigatorAnonymous';
import AppNavigatorAuthenticatedContainer from '../AppNavigatorAuthenticated';
import AppToastContainerContainer from '../AppToastContainer';
import ModalContainer from '../ModalContainer';
import { StyledContainerDiv } from './StyledComponents';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { pageview } from 'react-ga';

type Props = {
  appPersistenceHasLoaded: boolean,
  appViewerIsAuthenticated: boolean,
  workspaceProducerId: ?number
};

export default class AppRoot extends Component {
  props: Props;

  componentDidMount() {
    // Record Pageview of initial landing page
    pageview(location.pathname);

    // Record subsequent pageviews
    routerHistory.listen(location => {
      pageview(location.pathname);
    });
  }

  renderAppContents() {
    const { appViewerIsAuthenticated, workspaceProducerId } = this.props;

    if (!appViewerIsAuthenticated) {
      return <AppNavigatorAnonymousContainer />;
    }

    return (
      <AppNavigatorAuthenticatedContainer
        workspaceProducerId={workspaceProducerId}
      />
    );
  }

  render() {
    const { appPersistenceHasLoaded } = this.props;

    if (!appPersistenceHasLoaded) {
      return <ActivityIndicator />;
    }

    return (
      <Router history={routerHistory}>
        <StyledContainerDiv>
          {this.renderAppContents()}
          <AppFooter />
          <AppToastContainerContainer />
          <ModalContainer />
          <Alert stack={{ limit: 3 }} />
        </StyledContainerDiv>
      </Router>
    );
  }
}
