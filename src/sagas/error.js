/* eslint-disable no-console */
import { call, put, takeEvery } from 'redux-saga/effects';
import appToastAdd from '../actions/appToastAdd';

export default function* errorSaga() {
  yield takeEvery(({ error }) => error, function* handleError({
    meta,
    payload
  }) {
    const { description, suppress, title } = meta;

    // If action is not to be suppressed, and has a
    // title meta property, show an error toast
    if (!suppress && title) {
      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: description,
          title,
          toastKey: `error_${Date.now()}`
        })
      );
    }

    // Log the error
    yield call(console.error, payload, meta);
  });
}
