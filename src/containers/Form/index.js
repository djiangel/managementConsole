import { createElement } from 'react';
import { reduxForm } from 'redux-form';
import formSubmit from '../../actions/formSubmit';

type Props = {
  formConfiguration: ?Object,
  formName: string,
  render: (props: Object) => ?React$Element
};

const FormContainer = ({ formConfiguration, formName, render }: Props) =>
  createElement(
    reduxForm({
      form: formName,
      onSubmit: (_, dispatch) => dispatch(formSubmit(formName)),
      ...formConfiguration
    })(render)
  );

FormContainer.displayName = 'FormContainer';

export default FormContainer;
