import { call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { push as pushRoute } from 'react-router-redux';
import { CREATE_USER_FORM } from '../constants/formNames';
import createUser from '../consumers/httpCreateUser';
import formatPath from '../utils/formatPath';
import { USERS } from '../constants/routePaths';
import appToastAdd from '../actions/appToastAdd';

export default function* createUserFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === CREATE_USER_FORM
    );

    yield put(startSubmit(CREATE_USER_FORM));

    const createUserFormValues = yield select(getFormValues(CREATE_USER_FORM));

    createUserFormValues.email =
      createUserFormValues.email && createUserFormValues.email.toLowerCase();
    createUserFormValues.username = createUserFormValues.username.toLowerCase();

    try {
      // Submit createUserFormValues via createJSONWebToken...
      const { userId } = yield call(createUser, createUserFormValues);

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(CREATE_USER_FORM));

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `User ${userId} Created`,
          title: 'User Creation Successful',
          toastKey: `toast_${Date.now()}`
        })
      );

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(CREATE_USER_FORM));
    } catch (error) {
      yield put(stopSubmit(CREATE_USER_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create User',
          description: error.message
        })
      );
    }
  }
}
