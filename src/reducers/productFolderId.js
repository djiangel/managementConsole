import { PRODUCT_FOLDER_ID_SET } from '../actions/productFolderIdSet';
import { SESSION_CLEAR } from '../actions/sessionClear';

export default function productFolderId(state = 0, action) {
  switch (action.type) {
    case PRODUCT_FOLDER_ID_SET:
      return action.payload;

    case SESSION_CLEAR:
      return 0;

    default:
      return state;
  }
}
