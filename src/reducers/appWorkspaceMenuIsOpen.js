import { APP_WORKSPACE_MENU_IS_OPEN_SET } from '../actions/appWorkspaceMenuIsOpenSet';
import { WORKSPACE_PRODUCER_ID_SET } from '../actions/workspaceProducerIdSet';

const initialState: boolean = false;

export default function appWorkspaceMenuIsOpen(
  state: boolean = initialState,
  action
) {
  switch (action.type) {
    case APP_WORKSPACE_MENU_IS_OPEN_SET:
      return action.payload;

    // When the workspace producer id is set, close the app workspace menu
    case WORKSPACE_PRODUCER_ID_SET:
      return false;

    default:
      return state;
  }
}
