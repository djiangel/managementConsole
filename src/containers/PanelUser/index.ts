import PanelUser from './PanelUser';
import { connect } from 'react-redux';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';

const mapStateToProps = state => ({
  workspaceId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(PanelUser);
