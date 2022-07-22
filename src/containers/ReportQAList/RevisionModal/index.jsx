import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { REPORT_REVISION_FORM } from '../../../constants/formNames';
import formSubmit from '../../../actions/formSubmit';
import RevisionModal from './RevisionModal';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

const mapStateToProps = (state, props) => ({
  initialValues: {
    reportType: props.reportType,
    userId: props.userId,
    marketSurveyReportId: props.marketSurveyReportId,
    optimizationReportId: props.optimizationReportId,
    submittedOn: props.submittedOn,
    revision: null,
    pdfLink: null
  }
});

export default connect(mapStateToProps)(
  reduxForm({
    form: REPORT_REVISION_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(REPORT_REVISION_FORM));
    },
    validate: values => {
      return {
        revision: validation(values.revision),
        pdfLink: validation(values.pdfLink)
      };
    },
    enableReinitialize: true
  })(RevisionModal)
);
