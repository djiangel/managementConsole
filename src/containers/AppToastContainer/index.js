import { connect } from 'react-redux';
import appToastRemove from '../../actions/appToastRemove';
import selectAppPersistenceHasLoaded from '../../selectors/appToasts';
import AppToastContainer from './appToastContainer';

const mapStateToProps = state => ({
  toasts: selectAppPersistenceHasLoaded(state)
});

const actionCreators = {
  onRequestRemoveToast: appToastRemove
};

export default connect(
  mapStateToProps,
  actionCreators
)(AppToastContainer);
