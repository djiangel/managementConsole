import { call, takeLatest } from 'redux-saga/effects';
import { SESSION_CLEAR } from '../actions/sessionClear';
import graphqlClient from '../consumers/graphqlClient';

export default function* graphqlClientStoreResetSaga() {
  yield takeLatest([SESSION_CLEAR], function* graphqlClientStoreReset() {
    yield call(graphqlClient.resetStore);
  });
}
