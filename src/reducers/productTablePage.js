import { CHANGE_PRODUCT_TABLE_PAGE } from '../actions/changeProductTablePage';

export default function productTablePage(state = 1, action) {
  if (action.type === CHANGE_PRODUCT_TABLE_PAGE) {
    return action.payload;
  } else {
    return state;
  }
}
