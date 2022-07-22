import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import appViewerMenuIsOpenSet from '../../actions/appViewerMenuIsOpenSet';
import appViewerNotificationIsOpenSet from '../../actions/appViewerNotificationIsOpenSet';
import sessionClear from '../../actions/sessionClear';
import selectAppViewerMenuIsOpen from '../../selectors/appViewerMenuIsOpen';
import selectAppViewerNotificationIsOpen from '../../selectors/appViewerNotificationIsOpen';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import selectSessionToken from '../../selectors/sessionToken';
import AppHeaderViewerMenu from './AppHeaderViewerMenu';
import ViewerQuery from '../../graphql/queries/ViewerQuery';

const mapStateToProps = state => ({
  menuIsOpen: selectAppViewerMenuIsOpen(state),
  notificationIsOpen: selectAppViewerNotificationIsOpen(state),
  viewerIsAuthenticated: !!selectSessionToken(state),
  workspaceProducerId: selectWorkspaceProducerId(state)
});

const actionCreators = {
  onClickCloseMenu: () => appViewerMenuIsOpenSet(false),
  onClickOpenMenu: () => appViewerMenuIsOpenSet(true),
  onClickCloseNotification: () => appViewerNotificationIsOpenSet(false),
  onClickOpenNotification: () => appViewerNotificationIsOpenSet(true),
  onClickSignOut: sessionClear
};

export default compose(
  graphql<any, any, any, any>(ViewerQuery, {
    props: ({ data: { viewer } }) => ({
      viewerId: viewer && viewer.id,
      viewerEmail: viewer && viewer.email,
      viewerName: viewer && viewer.name,
      viewerUsername: viewer && viewer.username,
      viewerLanguage: viewer && viewer.interfaceLanguage
    })
  }),
  connect(
    mapStateToProps,
    actionCreators
  )
)(AppHeaderViewerMenu);
