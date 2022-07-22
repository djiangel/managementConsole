import { LOCATION_CHANGE } from 'react-router-redux';
import { APP_VIEWER_MENU_IS_OPEN_SET } from '../actions/appViewerMenuIsOpenSet';

const initialState: boolean = false;

export default function appViewerMenuIsOpen(
  state: boolean = initialState,
  action
) {
  switch (action.type) {
    case APP_VIEWER_MENU_IS_OPEN_SET:
      return action.payload;

    // When the router location changes, close the app viewer menu
    case LOCATION_CHANGE:
      return false;

    default:
      return state;
  }
}
