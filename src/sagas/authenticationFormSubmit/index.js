import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import errorAction from '../../actions/error';
import { FORM_SUBMIT } from '../../actions/formSubmit';
import sessionSet from '../../actions/sessionSet';
import { AUTHENTICATION_FORM } from '../../constants/formNames';
import createJSONWebToken from '../../consumers/httpCreateJSONWebToken';
import redirectToFirstWorkspaceSaga from './redirectToFirstWorkspace';

export default function* authenticationFormSubmitSaga() {
  yield takeEvery(
    ({ type, payload }) =>
      type === FORM_SUBMIT && payload === AUTHENTICATION_FORM,
    function* authenticationFormSubmit() {
      yield put(startSubmit(AUTHENTICATION_FORM));

      const authenticationFormValues = yield select(
        getFormValues(AUTHENTICATION_FORM)
      );

      authenticationFormValues.email = authenticationFormValues.email.toLowerCase();

      try {
        // Submit authenticationFormValues via createJSONWebToken...
        const { token, userId } = yield call(
          createJSONWebToken,
          authenticationFormValues
        );

        // If this point is reached, the form was submitted without error
        yield put(stopSubmit(AUTHENTICATION_FORM));

        yield put(
          sessionSet({
            token,
            userId
          })
        );
        yield fork(redirectToFirstWorkspaceSaga);
      } catch (error) {
        yield put(stopSubmit(AUTHENTICATION_FORM, error));
        yield put(
          errorAction({
            error,
            title: 'Failed to Sign In',
            description: error.message
          })
        );
      }
    }
  );
}
