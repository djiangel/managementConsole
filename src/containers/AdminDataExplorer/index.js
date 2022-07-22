import { connect } from 'react-redux';
import selectSessionToken from '../../selectors/sessionToken';
import AdminDataExplorer from './adminDataExplorer';

const mapStateToProps = state => ({
  sessionToken: selectSessionToken(state)
});

export default connect(mapStateToProps)(AdminDataExplorer);
