import { SESSION_CLEAR } from '../actions/sessionClear';
import { SESSION_SET } from '../actions/sessionSet';

type Session = {
  token: string,
  userId: string
};
type SessionState = ?Session;

const initialState: SessionState = null;

export default function session(state: SessionState = null, action: object) {
  switch (action.type) {
    case SESSION_SET:
      return action.payload;

    case SESSION_CLEAR:
      return initialState;

    default:
      return state;
  }
}
