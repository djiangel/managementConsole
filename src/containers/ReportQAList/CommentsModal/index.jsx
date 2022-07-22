import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { REPORT_QA_FORM } from '../../../constants/formNames';
import formSubmit from '../../../actions/formSubmit';
import CommentsModal from './CommentsModal';

const mapStateToProps = (state, props) => ({
  initialValues: {
    reportType: props.reportType,
    userId: props.userId,
    marketSurveyReportId: props.marketSurveyReportId,
    optimizationReportId: props.optimizationReportId,
    decision: props.decision,
    submittedOn: props.submittedOn,
    formatting: false,
    comparative: false,
    flavorProfile: false,
    sanityCheck: false,
    pqModel: false,
    request: false,
    archetype: false,
    other: false,
    formattingComment: '',
    comparativeComment: '',
    flavorProfileComment: '',
    sanityCheckComment: '',
    pqModelComment: '',
    requestComment: '',
    archetypeComment: '',
    otherComment: ''
  }
});

export default connect(mapStateToProps)(
  reduxForm({
    form: REPORT_QA_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(REPORT_QA_FORM));
    },
    enableReinitialize: true
  })(CommentsModal)
);
