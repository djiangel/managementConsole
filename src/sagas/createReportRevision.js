import { put, select, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { REPORT_REVISION_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import UpdateMarketSurveyReport from '../graphql/mutations/UpdateMarketSurveyReport';
import UpdateOptimizationReport from '../graphql/mutations/UpdateOptimizationReport';
import MarketSurveyReportByIdQuery from '../graphql/queries/MarketSurveyReportByIdQuery';
import CreateMarketSurveyReportMutation from '../graphql/mutations/CreateMarketSurveyReport';
import CreateOptimizationReportMutation from '../graphql/mutations/CreateOptimizationReport';
import AllMarketSurveyReportQuery from '../graphql/queries/AllMarketSurveyReportQuery';
import AllOptimizationReportQuery from '../graphql/queries/AllOptimizationReportQuery';
import OptimizationReportByIdQuery from '../graphql/queries/OptimizationReportByIdQuery';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import selectViewerUserId from '../selectors/viewerUserId';

export default function* CreateReportRevisionFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === REPORT_REVISION_FORM
    );

    yield put(startSubmit(REPORT_REVISION_FORM));

    const formValues = yield select(getFormValues(REPORT_REVISION_FORM));

    const viewerUserId = yield select(selectViewerUserId);
    const workspaceProducerId = yield select(selectWorkspaceProducerId);
    const prevMarketSurvey = formValues.marketSurveyReportId
      ? yield graphqlClient.query({
          query: MarketSurveyReportByIdQuery,
          variables: {
            id: formValues.marketSurveyReportId
          }
        })
      : null;

    const prevOptimization = formValues.optimizationReportId
      ? yield graphqlClient.query({
          query: OptimizationReportByIdQuery,
          variables: {
            id: formValues.optimizationReportId
          }
        })
      : null;

    const prevMS =
      prevMarketSurvey && prevMarketSurvey.data
        ? prevMarketSurvey.data.report
        : null;
    const revisedMarketSurvey = prevMS && {
      userId: viewerUserId,
      producerId: prevMS.producerId,
      projectName: prevMS.projectName,
      demographic: prevMS.demographic,
      client: prevMS.client,
      productIds: prevMS.productIds,
      selectedCountries: prevMS.selectedCountries,
      selectedAges: prevMS.selectedAges,
      selectedEthnicities: prevMS.selectedEthnicities,
      selectedGenders: prevMS.selectedGenders,
      // selectedSmokingHabits: prevMS.smokingHabits,
      selectedSocioEcon: prevMS.selectedSocioEcon,
      selectedRegionTarget: prevMS.selectedRegionTarget,
      includeTexture: prevMS.includeTexture,
      versionNo: prevMS.versionNo ? prevMS.versionNo + 1 : 1,
      rootId: prevMS.rootId ? prevMS.rootId : prevMS.id,
      pdfLink: formValues.pdfLink,
      comment: formValues.revision,
      status: 'In QA'
    };

    const prevOP =
      prevOptimization && prevOptimization.data
        ? prevOptimization.data.report
        : null;
    const revisedOptimization = prevOP && {
      userId: viewerUserId,
      producerId: workspaceProducerId,
      projectName: prevOP.projectName,
      demographic: prevOP.demographic,
      client: prevOP.client,
      productIds: prevOP.productIds,
      selectedCountries: prevOP.selectedCountries,
      selectedAges: prevOP.selectedAges,
      selectedEthnicities: prevOP.selectedEthnicities,
      selectedGenders: prevOP.selectedGenders,
      // selectedSmokingHabits: prevOP.smokingHabits,
      selectedSocioEcon: prevOP.selectedSocioEcon,
      selectedRegionTarget: prevOP.selectedRegionTarget,
      versionNo: prevOP.versionNo ? prevOP.versionNo + 1 : 1,
      rootId: prevOP.rootId ? prevOP.rootId : prevOP.id,
      pdfLink: formValues.pdfLink,
      comment: formValues.revision,
      status: 'In QA'
    };

    try {
      // Submit formValues via createJSONWebToken...
      formValues.marketSurveyReportId
        ? yield graphqlClient.mutate({
            mutation: UpdateMarketSurveyReport,
            variables: {
              id: formValues.marketSurveyReportId,
              patch: {
                status: 'Revised'
              }
            }
          }) &&
            graphqlClient.mutate({
              mutation: CreateMarketSurveyReportMutation,
              variables: {
                marketSurveyReport: revisedMarketSurvey
              },
              refetchQueries: ['AllMarketSurveyReportQuery']
            })
        : yield graphqlClient.mutate({
            mutation: UpdateOptimizationReport,
            variables: {
              id: formValues.optimizationReportId,
              patch: {
                status: 'Revised'
              }
            }
          }) &&
            graphqlClient.mutate({
              mutation: CreateOptimizationReportMutation,
              variables: {
                optimizationReport: revisedOptimization
              },
              refetchQueries: ['AllOptimizationReportQuery']
            });

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(REPORT_REVISION_FORM));

      // Destroy the form so that it is re-rendered after the below route change
      //   yield put(destroy(REPORT_REVISION_FORM));
    } catch (error) {
      yield put(stopSubmit(REPORT_REVISION_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Report Revision',
          description: error.message
        })
      );
    }
  }
}
