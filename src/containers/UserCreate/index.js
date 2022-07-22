import { reduxForm } from 'redux-form';
import { CREATE_USER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import UserCreateContainer from './UserCreateContainer';

const validation = val => !val || (typeof val === 'object' && val.length === 0);
const validatePassword = pass => !pass || (pass && pass.length < 6);

export default reduxForm({
  form: CREATE_USER_FORM,
  onSubmit: (values, dispatch) => {
    console.log(values);
    dispatch(formSubmit(CREATE_USER_FORM));
  },
  validate: values => {
    return {
      username: validation(values.username),
      password: validatePassword(values.password)
    };
  }
})(UserCreateContainer);
