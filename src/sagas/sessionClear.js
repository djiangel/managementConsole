/* global location */
import { take, takeEvery } from 'redux-saga/effects';
import { SAVE } from 'redux-storage';
import { SESSION_CLEAR } from '../actions/sessionClear';

export default function* sessionClearSaga() {
  yield takeEvery(SESSION_CLEAR, function* sessionClear() {
    yield take(SAVE);

    location.reload(); // eslint-disable-line
  });
}
