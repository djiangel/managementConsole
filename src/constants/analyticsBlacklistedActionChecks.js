import { includes, values } from 'lodash';
import { actionTypes as reduxFormActionTypes } from 'redux-form';
import { LOAD, SAVE } from 'redux-storage';

export default [
  // Uninteresting system actions...
  ({ type }) => includes([...values(reduxFormActionTypes), LOAD, SAVE], type)
];
