import { call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { push as pushRoute } from 'react-router-redux';
import { CHANGE_PASSWORD_FORM } from '../constants/formNames';
import changePassword from '../consumers/httpChangePassword';
import formatPath from '../utils/formatPath';
import { USERS } from '../constants/routePaths';
import appToastAdd from '../actions/appToastAdd';
import selectSessionToken from '../selectors/sessionToken';

export default function* changePasswordFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === CHANGE_PASSWORD_FORM
    );

    yield put(startSubmit(CHANGE_PASSWORD_FORM));

    const sessionToken = yield select(selectSessionToken);
    const changePasswordFormValues = yield select(
      getFormValues(CHANGE_PASSWORD_FORM)
    );

    const payload = {
      password: changePasswordFormValues.password
    };

    if (changePasswordFormValues.identifier.value === 'username') {
      payload.username = changePasswordFormValues.username.toLowerCase();
    } else if (changePasswordFormValues.identifier.value === 'email') {
      payload.email = changePasswordFormValues.email.toLowerCase();
    }

    // console.log(payload);

    try {
      // Submit changePasswordFormValues via createJSONWebToken...
      const resp = yield call(changePassword, payload, sessionToken);

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(CHANGE_PASSWORD_FORM));

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Password of ${
            changePasswordFormValues.email
              ? changePasswordFormValues.email
              : changePasswordFormValues.username
          } changed`,
          title: resp,
          toastKey: `toast_${Date.now()}`
        })
      );

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(CHANGE_PASSWORD_FORM));
    } catch (error) {
      yield put(stopSubmit(CHANGE_PASSWORD_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Change Password',
          description: error.message
        })
      );
    }
  }
}
