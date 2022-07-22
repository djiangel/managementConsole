import { APP_TOAST_ADD } from '../actions/appToastAdd';
import { APP_TOAST_REMOVE } from '../actions/appToastRemove';
import { SESSION_CLEAR } from '../actions/sessionClear';

export const initialState = [];

export default function appPersistenceHasLoaded(
  state: Object[] = initialState,
  action
) {
  switch (action.type) {
    case APP_TOAST_ADD:
      return [...state, action.payload];

    case APP_TOAST_REMOVE:
      return state.filter(({ toastKey }) => toastKey !== action.payload);

    case SESSION_CLEAR:
      return initialState;

    default:
      return state;
  }
}
