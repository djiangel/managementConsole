/* global window  */
/* eslint-disable no-constant-condition */
import { includes } from 'lodash';
import { put, take } from 'redux-saga/effects';
import { LOAD } from 'redux-storage';
import analyticsBlacklistedActionChecks from '../constants/analyticsBlacklistedActionChecks';
import analyticsSensitiveActionChecks from '../constants/analyticsSensitiveActionChecks';
import errorAction from '../actions/error';

export default function* segmentActionTrackSaga() {
  yield take(LOAD);

  while (true) {
    const action = yield take();
    const analytics = window.analytics;
    const shouldTrackAction =
      !!analytics &&
      !includes(
        analyticsBlacklistedActionChecks.map(check => check(action)),
        true
      );

    if (shouldTrackAction) {
      const actionTypeIsSensitive = includes(
        analyticsSensitiveActionChecks.map(check => check(action)),
        true
      );
      const actionEventProperties = !actionTypeIsSensitive
        ? {
            payload: action.payload,
            meta: action.meta
          }
        : undefined;

      try {
        analytics.track(action.type, actionEventProperties);
      } catch (error) {
        yield put(
          errorAction({
            error,
            title: 'Failed to track action with Segment',
            description: error.message
          })
        );
      }
    }
  }
}
