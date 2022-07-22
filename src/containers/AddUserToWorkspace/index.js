import { reduxForm } from 'redux-form';
import { ADD_USER_PRODUCER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import AddUserToWorkspaceContainer from './AddUserToWorkspaceContainer';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default reduxForm({
  form: ADD_USER_PRODUCER_FORM,
  onSubmit: (values, dispatch) => {
    // console.log(values);
    dispatch(formSubmit(ADD_USER_PRODUCER_FORM));
  },
  validate: values => {
    return {
      email: validation(values.email),
      producerId: validation(values.producerId)
    };
  }
})(AddUserToWorkspaceContainer);
