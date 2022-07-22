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

export default function* segmentUserIdentifySaga() {
  yield take(LOAD);

  while (true) {
    const sessionToken = yield select(selectSessionToken);
    const analytics = window.analytics;

    // NOTE: Do not attempt to identify user with segment if `analytics` is not
    // available, or if the user is anonymous...
    if (analytics && sessionToken) {
      try {
        const viewerInfoResponse = yield graphqlClient.query({
          query: ViewerQuery
        });
        const viewerInfoResult = viewerInfoResponse.data;
        const viewerInfoData = viewerInfoResult.viewer;

        analytics.identify(viewerInfoData.id, {
          email: viewerInfoData.email,
          name: viewerInfoData.name,
          role: viewerInfoData.role,
          username: viewerInfoData.username
        });
      } catch (error) {
        yield put(
          errorAction({
            error,
            title: 'Failed to identify user with Segment',
            description: error.message,
            suppress: true
          })
        );
      }
    }

    yield take([SESSION_CLEAR, SESSION_SET]);
  }
}
