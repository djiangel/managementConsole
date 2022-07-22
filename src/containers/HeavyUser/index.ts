import { reduxForm, getFormValues } from 'redux-form';
import { HEAVY_USER_INFO_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import HeavyUser from './HeavyUser';
import { connect } from 'react-redux';
import { compose } from 'redux';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

const mapStateToProps = state => {
  const values = getFormValues(HEAVY_USER_INFO_FORM)(state);
  return {
    data: values && values.data
  };
};

export default compose<{}>(
  connect(mapStateToProps),
  reduxForm({
    form: HEAVY_USER_INFO_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(HEAVY_USER_INFO_FORM));
    },
    validate: values => {
      return {
        email: validation(values.email) && validation(values.username),
        username: validation(values.email) && validation(values.username)
      };
    }
  })
)(HeavyUser);
