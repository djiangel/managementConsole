/* eslint-disable no-console */
import { find, size } from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import errorAction from '../actions/error';
import sessionClear from '../actions/sessionClear';

export default function* clearSessionIfJWTExpiredSaga() {
  yield takeEvery(
    ({ error, payload }) =>
      error &&
      payload &&
      payload.graphQLErrors &&
      size(
        find(payload.graphQLErrors, ({ message }) => message === 'jwt expired')
      ),
    function* handleJWTExpiredError() {
      yield put(
        errorAction({
          error: new Error('Session expired'),
          title: 'Your session has expired',
          description: 'Please sign in again to continue.'
        })
      );

      yield put(sessionClear());
    }
  );
}
