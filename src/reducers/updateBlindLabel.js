const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_BLIND_LABEL':
      return {
        ...state,
        [action.payload.panelId]: {
          submitting: true,
          success: false
        }
      };
    case 'UPDATE_BLIND_LABEL_SUCCESS':
      return {
        ...state,
        [action.payload.panelId]: {
          submitting: false,
          success: true
        }
      };
    case 'UPDATE_BLIND_LABEL_FAILURE':
      return {
        ...state,
        [action.payload.panelId]: {
          submitting: false,
          success: false
        }
      };
    default:
      return state;
  }
}
