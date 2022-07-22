import { connect } from 'react-redux';
import selectAppPersistenceHasLoaded from '../../selectors/appPersistenceHasLoaded';
import selectSessionToken from '../../selectors/sessionToken';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import AppRoot from './appRoot';

const mapStateToProps = state => ({
  appPersistenceHasLoaded: selectAppPersistenceHasLoaded(state),
  appViewerIsAuthenticated: !!selectSessionToken(state),
  workspaceProducerId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(AppRoot);
