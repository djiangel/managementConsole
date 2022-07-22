/* global window  */
/* eslint-disable no-constant-condition */
import { put, select, take } from 'redux-saga/effects';
import { LOAD } from 'redux-storage';
import errorAction from '../actions/error';
import { SESSION_CLEAR } from '../actions/sessionClear';
import { SESSION_SET } from '../actions/sessionSet';
import graphqlClient from '../consumers/graphqlClient';
import selectSessionToken from '../selectors/sessionToken';
import ViewerQuery from '../graphql/queries/ViewerQuery';
import { set } from 'react-ga';

export default function* googleAnalyticsSetSessionSaga() {
  yield take(LOAD);

  while (true) {
    const sessionToken = yield select(selectSessionToken);
    const ga = window.ga;

    if (sessionToken && ga) {
      try {
        const viewerInfoResponse = yield graphqlClient.query({
          query: ViewerQuery
        });
        const viewerInfoResult = viewerInfoResponse.data;
        const viewerInfoData = viewerInfoResult.viewer;

        set({
          userId: viewerInfoData.id,
          role: viewerInfoData.role
        });
      } catch (error) {
        yield put(
          errorAction({
            error,
            title: 'Failed to set analytics session',
            description: error.message,
            suppress: true
          })
        );
      }
    }

    yield take([SESSION_CLEAR, SESSION_SET]);
  }
}
