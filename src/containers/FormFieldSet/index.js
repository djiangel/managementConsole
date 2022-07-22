import React from 'react';
import { Field } from 'redux-form';
import FormFieldSet from '../../components/FormFieldSet';
import FormInput from '../../components/FormInput';

type FieldConfig = {
  component: any,
  key: string,
  name: string
};

type Props = {
  fields: FieldConfig[],
  legendText: ?string
};

const FormFieldSetContainer = ({ fields, legendText, ...rest }: Props) => (
  <FormFieldSet
    {...rest}
    legendText={legendText}
    renderInputs={({ inputClassName }) =>
      fields.map(fieldConfig => (
        <Field
          className={inputClassName}
          component={fieldConfig.component || FormInput}
          key={fieldConfig.key}
          name={fieldConfig.name}
          {...fieldConfig}
        />
      ))
    }
  />
);

FormFieldSetContainer.displayName = 'FormFieldSetContainer';

export default FormFieldSetContainer;
