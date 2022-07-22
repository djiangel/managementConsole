import { reduxForm } from 'redux-form';
import formSubmit from '../../actions/formSubmit';
import { ADD_DEVICE_FORM } from '../../constants/formNames';
import DeviceCreateContainer from './DeviceCreateContainer';

export default reduxForm({
  form: ADD_DEVICE_FORM,
  onSubmit: (values, dispatch) => dispatch(formSubmit(ADD_DEVICE_FORM)),
  validate: values => ({ deviceUid: !values.deviceUid })
})(DeviceCreateContainer);
