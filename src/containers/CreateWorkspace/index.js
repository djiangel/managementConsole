import { reduxForm } from 'redux-form';
import { CREATE_WORKSPACE_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import CreateWorkspace from './CreateWorkspace';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default reduxForm({
  form: CREATE_WORKSPACE_FORM,
  onSubmit: (values, dispatch) => {
    dispatch(formSubmit(CREATE_WORKSPACE_FORM));
  },
  validate: values => {
    return {
      name: validation(values.name),
      slug: validation(values.slug),
      defaultTimezone: validation(values.defaultTimezone)
    };
  }
})(CreateWorkspace);
