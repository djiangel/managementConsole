/* eslint-disable no-console */
import { select, takeEvery } from 'redux-saga/effects';
import enableReduxLogging from '../constants/enableReduxLogging';

export default function* logSaga() {
  if (!enableReduxLogging) {
    return;
  }

  yield takeEvery('*', function* log(action) {
    console.group(action.type);
    console.info('dispatching', action);

    const nextState = yield select();
    console.log('next state', nextState);
    console.groupEnd(action.type);
  });
}
