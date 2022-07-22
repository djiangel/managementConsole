import { connect } from 'react-redux';
import selectSessionToken from '../../selectors/sessionToken';
import ConditionViewerIsAuthenticated from './conditionViewerIsAuthenticated';

const mapStateToProps = state => ({
  viewerIsAuthenticated: !!selectSessionToken(state)
});

export default connect(mapStateToProps)(ConditionViewerIsAuthenticated);
