import { put, select, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { REPORT_QA_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import UpdateMarketSurveyReport from '../graphql/mutations/UpdateMarketSurveyReport';
import UpdateOptimizationReport from '../graphql/mutations/UpdateOptimizationReport';
import CreateReportQaMutation from '../graphql/mutations/CreateReportQa';

export default function* CreateReportQaFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) => type === FORM_SUBMIT && payload === REPORT_QA_FORM
    );

    yield put(startSubmit(REPORT_QA_FORM));

    const createReportQaFormValues = yield select(
      getFormValues(REPORT_QA_FORM)
    );

    const reportQaToCreate = {
      formatting: {
        selected: createReportQaFormValues.formatting,
        comment: createReportQaFormValues.formattingComment
      },
      comparative: {
        selected: createReportQaFormValues.comparative,
        comment: createReportQaFormValues.comparativeComment
      },
      flavorProfile: {
        selected: createReportQaFormValues.flavorProfile,
        comment: createReportQaFormValues.flavorProfileComment
      },
      sanityCheck: {
        selected: createReportQaFormValues.sanityCheck,
        comment: createReportQaFormValues.sanityCheckComment
      },
      pqModel: {
        selected: createReportQaFormValues.pqModel,
        comment: createReportQaFormValues.pqModelComment
      },
      request: {
        selected: createReportQaFormValues.request,
        comment: createReportQaFormValues.requestComment
      },
      archetype: {
        selected: createReportQaFormValues.archetype,
        comment: createReportQaFormValues.archetypeComment
      },
      other: {
        selected: createReportQaFormValues.other,
        comment: createReportQaFormValues.otherComment
      }
    };

    try {
      // Submit createReportQaFormValues via createJSONWebToken...
      createReportQaFormValues.marketSurveyReportId
        ? yield graphqlClient.mutate({
            mutation: UpdateMarketSurveyReport,
            variables: {
              id: createReportQaFormValues.marketSurveyReportId,
              patch: {
                status: 'Rejected'
              }
            },
            refetchQueries: ['AllMarketSurveyReportQuery']
          })
        : yield graphqlClient.mutate({
            mutation: UpdateOptimizationReport,
            variables: {
              id: createReportQaFormValues.optimizationReportId,
              patch: {
                status: 'Rejected'
              }
            },
            refetchQueries: ['AllOptimizationReportQuery']
          });

      yield graphqlClient.mutate({
        mutation: CreateReportQaMutation,
        variables: {
          reportQa: {
            reportType: createReportQaFormValues.reportType,
            userId: createReportQaFormValues.userId,
            marketSurveyReportId: createReportQaFormValues.marketSurveyReportId,
            optimizationReportId: createReportQaFormValues.optimizationReportId,
            decision: createReportQaFormValues.decision,
            submittedOn: createReportQaFormValues.submittedOn,
            comment: reportQaToCreate
          }
        }
      });

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(REPORT_QA_FORM));

      // Destroy the form so that it is re-rendered after the below route change
      //   yield put(destroy(REPORT_QA_FORM));
    } catch (error) {
      yield put(stopSubmit(REPORT_QA_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Report Qa',
          description: error.message
        })
      );
    }
  }
}
