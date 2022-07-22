import { reduxForm } from 'redux-form';
import { CHANGE_PASSWORD_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import ChangePasswordContainer from './ChangePaswordContainer';

const validation = val => !val || (typeof val === 'object' && val.length === 0);
const validatePassword = pass => !pass || (pass && pass.length < 6);

export default reduxForm({
  form: CHANGE_PASSWORD_FORM,
  onSubmit: (values, dispatch) => {
    // console.log(values);
    dispatch(formSubmit(CHANGE_PASSWORD_FORM));
  },
  validate: values => {
    return {
      identifier:
        !values.identifier ||
        (values.identifier.value !== 'username' &&
          values.identifier.value !== 'email'),
      username:
        values.identifier && values.identifier.value === 'username'
          ? validation(values.username)
          : true,
      email:
        values.identifier && values.identifier.value === 'email'
          ? validation(values.email)
          : true,
      password: validatePassword(values.password)
    };
  }
})(ChangePasswordContainer);
