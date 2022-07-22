import { reduxForm } from 'redux-form';
import { MERGE_ACCOUNT_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MergeAccountContainer from './MergeAccountContainer';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default reduxForm({
  form: MERGE_ACCOUNT_FORM,
  onSubmit: (values, dispatch) => {
    dispatch(formSubmit(MERGE_ACCOUNT_FORM));
  },
  validate: values => {
    return {
      newEmail: validation(values.newEmail),
      oldEmail: validation(values.oldEmail)
    };
  }
})(MergeAccountContainer);
