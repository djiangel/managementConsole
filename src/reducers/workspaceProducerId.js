import { SESSION_CLEAR } from '../actions/sessionClear';
import { WORKSPACE_PRODUCER_ID_SET } from '../actions/workspaceProducerIdSet';

type WorkspaceProducerIdState = ?number;

const initialState: WorkspaceProducerIdState = null;

export default function workspaceProducerId(
  state: WorkspaceProducerIdState = initialState,
  action
) {
  switch (action.type) {
    case SESSION_CLEAR:
      return initialState;

    case WORKSPACE_PRODUCER_ID_SET:
      return action.payload;

    default:
      return state;
  }
}
