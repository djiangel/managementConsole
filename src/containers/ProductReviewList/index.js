import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import ProductReviewList from './productReviewList';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(ProductReviewList);
