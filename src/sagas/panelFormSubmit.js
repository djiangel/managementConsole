/* eslint-disable no-constant-condition */
import { all, put, select, take } from 'redux-saga/effects';
import { destroy, getFormValues, startSubmit, stopSubmit } from 'redux-form';
import { push as pushRoute } from 'react-router-redux';
import addMilliseconds from 'date-fns/addMilliseconds';
import ms from 'ms';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { PANEL_FORM } from '../constants/formNames';
import { PANEL } from '../constants/routePaths';
import graphqlClient from '../consumers/graphqlClient';
import CreatePanelMutation from '../graphql/mutations/CreatePanel';
import CreatePanelProductMutation from '../graphql/mutations/CreatePanelProduct';
import selectViewerUserId from '../selectors/viewerUserId';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import formatPath from '../utils/formatPath';
import PanelQuery from '../graphql/queries/Panel';

export default function* panelFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) => type === FORM_SUBMIT && payload === PANEL_FORM
    );

    yield put(startSubmit(PANEL_FORM));

    const panelFormValues = yield select(getFormValues(PANEL_FORM));
    const viewerUserId = yield select(selectViewerUserId);
    const workspaceProducerId = yield select(selectWorkspaceProducerId);
    const panelProducts = panelFormValues.panelProducts;
    const currentDate = new Date();
    const timeLimitMilliseconds = ms(panelFormValues.timeLimit);
    // LATER: Add the ability to schedule panels to start at a future time
    const startTime = currentDate;
    const endTime = addMilliseconds(currentDate, timeLimitMilliseconds);
    const panel = {
      producerId: workspaceProducerId,
      userId: viewerUserId,
      blind: panelFormValues.blind,
      startTime,
      endTime
    };

    try {
      // Add panel...
      const addPanelMutationResult = yield graphqlClient.mutate({
        mutation: CreatePanelMutation,
        variables: {
          panel
        }
      });

      const panelId =
        addPanelMutationResult &&
        addPanelMutationResult.data &&
        addPanelMutationResult.data.createPanel &&
        addPanelMutationResult.data.createPanel.panel &&
        addPanelMutationResult.data.createPanel.panel.id;

      // Add PanelProducts for each product...
      yield all(
        panelProducts.map((panelProduct, index) =>
          graphqlClient.mutate({
            mutation: CreatePanelProductMutation,
            variables: {
              panelProduct: {
                attributes:
                  panelProduct.attributes &&
                  panelProduct.attributes.reduce(
                    (memo, attribute) => ({
                      ...memo,
                      [attribute.key]: attribute.value
                    }),
                    {}
                  ),
                batchIdentifier: panelProduct.batchIdentifier,
                order: index,
                panelId,
                productId: panelProduct.productId
              }
            },
            refetchQueries: ['AvailablePanelsQuery']
          })
        )
      );

      yield graphqlClient.query({
        query: PanelQuery,
        variables: {
          panelId
        }
      });

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(PANEL_FORM));

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(PANEL_FORM));

      yield put(
        pushRoute(
          formatPath(PANEL, {
            panelId
          })
        )
      );
    } catch (error) {
      yield put(stopSubmit(PANEL_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Panel',
          description: error.message
        })
      );
    }
  }
}
