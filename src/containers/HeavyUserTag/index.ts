import { reduxForm, getFormValues } from 'redux-form';
import { TAG_HEAVY_USER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import HeavyUserTag from './HeavyUserTag';
import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { compose } from 'redux';

const validation = val => !val || (typeof val === 'object' && val.length === 0);

const mapStateToProps = state => {
  const values = getFormValues(TAG_HEAVY_USER_FORM)(state);
  return {
    producerId: selectWorkspaceProducerId(state),
    email: values && values.email,
    username: values && values.username,
    notFoundUsers: values && values.notFoundUsers
  };
};

export default compose<{}>(
  connect(mapStateToProps),
  reduxForm({
    form: TAG_HEAVY_USER_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(TAG_HEAVY_USER_FORM));
    },
    validate: values => {
      return {
        usersFromCsv: validation(values.usersFromCsv),
        tag: validation(values.tag),
        categories:
          validation(values.categories) &&
          validation(values.features) &&
          validation(values.componentBases) &&
          validation(values.componentOthers),
        features:
          validation(values.categories) &&
          validation(values.features) &&
          validation(values.componentBases) &&
          validation(values.componentOthers),
        componentBases:
          validation(values.categories) &&
          validation(values.features) &&
          validation(values.componentBases) &&
          validation(values.componentOthers),
        componentOthers:
          validation(values.categories) &&
          validation(values.features) &&
          validation(values.componentBases) &&
          validation(values.componentOthers)
      };
    }
  })
)(HeavyUserTag);
