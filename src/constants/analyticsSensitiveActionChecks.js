import { FORM_SUBMIT } from '../actions/formSubmit';
import { SESSION_SET } from '../actions/sessionSet';
import { AUTHENTICATION_FORM } from '../constants/formNames';

export default [
  // Session token set (contains session token)
  ({ type }) => type === SESSION_SET,
  // Authentication form submit (contains password)
  ({ type, payload }) => type === FORM_SUBMIT && payload === AUTHENTICATION_FORM
];
