/* eslint-disable no-constant-condition */
import { put, select, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import { push as pushRoute } from 'react-router-redux';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { BATCH_INITIALIZATION_FORM } from '../constants/formNames';
import { BATCH_STATE_OVERVIEW } from '../constants/routePaths';
import graphqlClient from '../consumers/graphqlClient';
import InitializeBatchMutation from '../graphql/mutations/InitializeBatch';
import selectRouterLocationProducerSlug from '../selectors/routerLocationProducerSlug';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import formatPath from '../utils/formatPath';

export default function* batchInitializationFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === BATCH_INITIALIZATION_FORM
    );

    yield put(startSubmit(BATCH_INITIALIZATION_FORM));

    const workspaceProducerId = yield select(selectWorkspaceProducerId);
    const batchInitializationFormValues = yield select(
      getFormValues(BATCH_INITIALIZATION_FORM)
    );
    const batchState = {
      ...batchInitializationFormValues,
      producerId: workspaceProducerId
    };

    try {
      // Initialize batch...
      const initializeBatchMutationResult = yield graphqlClient.mutate({
        mutation: InitializeBatchMutation,
        variables: {
          batchState
        }
      });
      const batchStateId =
        initializeBatchMutationResult &&
        initializeBatchMutationResult.data &&
        initializeBatchMutationResult.data.createBatchState &&
        initializeBatchMutationResult.data.createBatchState.batchState &&
        initializeBatchMutationResult.data.createBatchState.batchState.id;

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(BATCH_INITIALIZATION_FORM));

      // Redirect to newly-created batch state
      // FIXME: Should redirect to new *batch* instead?
      const routerLocationProducerSlug = yield select(
        selectRouterLocationProducerSlug
      );
      yield put(
        pushRoute(
          formatPath(BATCH_STATE_OVERVIEW, {
            producerSlug: routerLocationProducerSlug,
            batchStateId
          })
        )
      );
    } catch (error) {
      yield put(stopSubmit(BATCH_INITIALIZATION_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Batch',
          description: error.message
        })
      );
    }
  }
}
