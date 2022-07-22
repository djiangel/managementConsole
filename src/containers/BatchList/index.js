import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import BatchList from './batchList';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(BatchList);
