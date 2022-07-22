import * as React from 'react';
import { TextField } from '../material/index';

export default function FormikTextInput(props) {
  const {
    field,
    form: { touched, errors }
  } = props;

  return (
    <TextField
      type="text"
      label={props.label}
      inputProps={field}
      error={touched[field.name] && errors[field.name]}
      {...field}
    />
  );
}
