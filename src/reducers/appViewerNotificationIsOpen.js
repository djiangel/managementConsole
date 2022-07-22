import { LOCATION_CHANGE } from 'react-router-redux';
import { APP_VIEWER_NOTIFICATION_IS_OPEN_SET } from '../actions/appViewerNotificationIsOpenSet';

const initialState: boolean = false;

export default function appViewerNotificationIsOpen(
  state: boolean = initialState,
  action
) {
  switch (action.type) {
    case APP_VIEWER_NOTIFICATION_IS_OPEN_SET:
      return action.payload;

    // When the router location changes, close the app viewer notification
    case LOCATION_CHANGE:
      return false;

    default:
      return state;
  }
}
