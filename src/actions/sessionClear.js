import { createAction } from 'redux-actions';

export const SESSION_CLEAR = 'SESSION_CLEAR';

export default createAction(SESSION_CLEAR, () => undefined);
