import React from 'react';
import { connect } from 'react-redux';
import AppHeader from '../../components/AppHeader';
import selectSessionToken from '../../selectors/sessionToken';
import AppHeaderWorkspaceMenuContainer from '../AppHeaderWorkspaceMenu';
import AppHeaderViewerMenuContainer from '../AppHeaderViewerMenu';

const mapStateToProps = state => ({
  viewerIsAuthenticated: !!selectSessionToken(state)
});

const mergeProps = (stateProps, _, ownProps) => ({
  ...ownProps,

  renderLeftItem: () =>
    stateProps.viewerIsAuthenticated && <AppHeaderWorkspaceMenuContainer />,
  renderViewerMenu: () => <AppHeaderViewerMenuContainer />
});

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(AppHeader);
