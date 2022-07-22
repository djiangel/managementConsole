import { SHOW_MODAL } from '../actions/modal/showModal';
import { HIDE_MODAL } from '../actions/modal/hideModal';
import { SESSION_CLEAR } from '../actions/sessionClear';

export const initialState = { open: false };

export default function modal(state: Object = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        open: true,
        ...action.payload
      };

    case HIDE_MODAL:
      return { open: false };

    case SESSION_CLEAR:
      return initialState;

    default:
      return state;
  }
}
