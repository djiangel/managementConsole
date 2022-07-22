import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { PRODUCT_FEATURE_TAG_FORM } from '../../../constants/formNames';
import formSubmit from '../../../actions/formSubmit';
import TagModal from './TagModal';
import selectWorkspaceProducerId from '../../../selectors/workspaceProducerId';

const mapStateToProps = (state, props) => ({
  producerId: selectWorkspaceProducerId(state),
  initialValues: {
    products: props.products
  }
});

export default connect(mapStateToProps)(
  reduxForm({
    form: PRODUCT_FEATURE_TAG_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(PRODUCT_FEATURE_TAG_FORM));
    },
    enableReinitialize: true
  })(TagModal)
);
