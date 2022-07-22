import React from 'react';

import { Field } from 'redux-form';
import FormInputSelect from '../FormInputSelect';

import styles from './RenderTextFieldSuffix.module.css';
import FieldTextInput from '../FieldTextInput';

export default function RenderTextFieldSuffix(props) {
  const { options, validate } = props;

  return (
    <div className={styles.container}>
      <Field
        name="value"
        validate={validate}
        component={props => {
          const { input, meta, ...rest } = props;

          return <FieldTextInput input={input} meta={meta} {...rest} />;
        }}
      />
      <Field
        name="unit"
        component={props => {
          const { input, ...rest } = props;
          return (
            <FormInputSelect
              options={options}
              isClearable
              {...input}
              {...rest}
            />
          );
        }}
      />
    </div>
  );
}
