import { LOAD } from 'redux-storage';

export const initialState = false;

export default function appPersistenceHasLoaded(
  state: boolean = initialState,
  action
) {
  switch (action.type) {
    case LOAD:
      return true;

    default:
      return state;
  }
}
