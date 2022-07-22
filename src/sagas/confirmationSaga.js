import { put, race, take } from 'redux-saga/effects';
import showModal from '../actions/modal/showModal';
import hideModal from '../actions/modal/hideModal';
import MODAL_CONFIRM_YES from '../actions/modal/modalConfirmYes';
import MODAL_CONFIRM_NO from '../actions/modal/modalConfirmNo';

export default function* confirmationSaga(payload) {
  try {
    yield put(showModal(payload));
    const { yes } = yield race({
      yes: take(MODAL_CONFIRM_YES),
      no: take(MODAL_CONFIRM_NO)
    });
    yield put(hideModal());
    return Boolean(yes);
  } catch (e) {
    console.error(e);
  }
}
