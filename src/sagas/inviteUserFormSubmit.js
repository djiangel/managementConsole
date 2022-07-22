import { take, select, put, call } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit } from 'redux-form';
import inviteUserEmail from '../consumers/httpInviteUserEmail';
import { INVITE_USER_FORM } from '../constants/formNames';
import { FORM_SUBMIT } from '../actions/formSubmit';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';

export default function* inviteUserFormSubmitFn() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === INVITE_USER_FORM
    );
    yield put(startSubmit(INVITE_USER_FORM));
    const inviteUserFormValues = yield select(getFormValues(INVITE_USER_FORM));
    const workspaceProducerId = yield select(selectWorkspaceProducerId);

    inviteUserFormValues.producerId = workspaceProducerId;

    try {
      yield call(inviteUserEmail, inviteUserFormValues);
      yield put(stopSubmit(INVITE_USER_FORM));
    } catch (error) {
      console.log(error);
      yield put(stopSubmit(RESET_PASSWORD_FORM, error));
    }
  }
}
