import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getFormValues, change } from 'redux-form';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import styles from './RequestReport.module.css';
import { withTranslation } from 'react-i18next';
import MaterialButton from '../../components/MaterialButton';
import { REQUEST_REPORT_FORM } from '../../constants/formNames';
import { Stepper, StepLabel, StepButton, Step, Paper } from '@material-ui/core';
import StepperIcon from '../../components/StepperIcon';
import ReportType from './ReportType';
import MarketSurvey from './MarketSurvey';
import Optimization from './Optimization';
import Demographics from './Demographics';
import Confirmation from './Confirmation';
import RequestSent from './RequestSent';
import { MARKET_SURVEY, PRODUCT, OPTIMIZATION } from '../../constants/report';
import { Fragment } from 'react';
import ClassDBTable from './ClassDBTable';
import ConditionViewerRoleIsAdminContainer from '../ConditionViewerRoleIsAdmin';
import { event } from 'react-ga';
import { CAT_REQUEST_REPORT } from '../../constants/googleAnalytics/categories';
import {
  REQUEST_REPORT_SUBMIT,
  REQUEST_REPORT_NEXT,
  REQUEST_REPORT_PREV,
  REQUEST_REPORT_MOVE_STEP
} from '../../constants/googleAnalytics/actions';
import { RR_STEP_LABELS } from '../../constants/googleAnalytics/labels';

const STEPS = [
  'Select Report Type',
  'Target Demographics',
  'Competitive Set',
  'Confirm'
];

class RequestReport extends Component {
  state = {
    activeStep: 0,
    submitted: false,
    openClassDB: false
  };

  // Handler for breadcrumb
  handleBackStep = () => {
    event({
      category: CAT_REQUEST_REPORT,
      action: REQUEST_REPORT_PREV,
      label: RR_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleNextStep = () => {
    event({
      category: CAT_REQUEST_REPORT,
      action: REQUEST_REPORT_NEXT,
      label: RR_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    if (this.props.type)
      this.setState({
        activeStep: this.state.activeStep + 1
      });
  };

  handleStep = step => () => {
    event({
      category: CAT_REQUEST_REPORT,
      action: REQUEST_REPORT_MOVE_STEP,
      // The step the button is clicked - target step
      label: `${RR_STEP_LABELS[this.state.activeStep]} - ${
        RR_STEP_LABELS[step]
      }`
    });

    if (this.props.type)
      this.setState({
        activeStep: step
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      if (this.props.products.length) this.props.change('products', []);

      if (this.props.folders.length) this.props.change('folders', []);
    }
  }

  render() {
    const {
      t,
      type,
      pristine,
      invalid,
      submitting,
      submitFailed,
      submitSucceeded,
      handleSubmit,
      projectName,
      products,
      folders,
      categories,
      submittedProjectName,
      submittedType
    } = this.props;
    const { activeStep, submitted, submitResult, openClassDB } = this.state;
    {
      type.value === OPTIMIZATION && (STEPS[1] = 'Optimization Target');
    }

    if (submitted) {
      return (
        <RequestSent
          submitFailed={submitFailed}
          submitSucceeded={submitSucceeded}
          submitting={submitting}
          type={submittedType && submittedType.value}
          projectName={submittedProjectName}
        />
      );
    }

    return (
      <Fragment>
        <Paper className={styles.container}>
          <Stepper activeStep={activeStep} nonLinear alternativeLabel>
            {STEPS.map((label, index) => (
              <Step key={label}>
                {/* <StepButton onClick={this.handleStep(index)}> */}
                <StepLabel StepIconComponent={StepperIcon}>{label}</StepLabel>
                {/* </StepButton> */}
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <ReportType type={type} producerId={this.props.producerId} />
          )}

          {activeStep === 1 && <Demographics {...this.props} />}

          {activeStep === 2 &&
            (type.value === MARKET_SURVEY || type.value === PRODUCT) && (
              <MarketSurvey {...this.props} />
            )}
          {activeStep === 2 &&
            type.value === OPTIMIZATION && <Optimization {...this.props} />}

          {activeStep === 3 && <Confirmation type={type} {...this.props} />}

          <div className={styles.buttonContainer}>
            <ConditionViewerRoleIsAdminContainer
              render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) =>
                viewerRoleIsSuperadmin &&
                activeStep === 2 &&
                (type.value === MARKET_SURVEY || type.value === PRODUCT) &&
                products.length > 0 && (
                  <MaterialButton
                    onClick={() => this.setState({ openClassDB: !openClassDB })}
                    variant="outlined"
                    soft
                    teal
                  >
                    View Class DB
                  </MaterialButton>
                )
              }
            />
            {activeStep > 0 && (
              <MaterialButton
                onClick={() => this.handleBackStep()}
                variant="outlined"
                soft
              >
                Back
              </MaterialButton>
            )}
            {activeStep < STEPS.length - 1 && (
              <MaterialButton
                onClick={() => this.handleNextStep()}
                variant="outlined"
                soft
                teal
                disabled={
                  invalid ||
                  (activeStep === 2 &&
                    ((!products.length &&
                      (type.value !== MARKET_SURVEY || !folders.length)) ||
                      products.filter(product => !!product.category).length <=
                        0))
                }
              >
                Next
              </MaterialButton>
            )}
            {activeStep === STEPS.length - 1 && (
              <MaterialButton
                variant="outlined"
                disabled={pristine || invalid || submitting}
                onClick={() => {
                  event({
                    category: CAT_REQUEST_REPORT,
                    action: REQUEST_REPORT_SUBMIT
                  });
                  this.setState({ submitted: true });
                  handleSubmit();
                }}
                soft
                teal
              >
                {t('general.confirm')}
              </MaterialButton>
            )}
          </div>
        </Paper>

        {openClassDB &&
          activeStep === 2 &&
          (type.value === MARKET_SURVEY || type.value === PRODUCT) && (
            <Paper className={styles.container}>
              <ClassDBTable
                productIds={products.map(product => product.id)}
                categories={products
                  .filter(product => !!product.category)
                  .map(product => product.category)}
              />
            </Paper>
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const formValues = getFormValues(REQUEST_REPORT_FORM)(state);

  return {
    producerId: selectWorkspaceProducerId(state),
    ...formValues
  };
};

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(RequestReport);
