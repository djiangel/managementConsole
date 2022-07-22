import React from 'react';

import NumberFormat from 'react-number-format';
import FieldTextInput from '../FieldTextInput';

export default function RenderTimePicker(props) {
  const { input, onChange, ...rest } = props;

  return (
    <FieldTextInput
      input={input}
      {...rest}
      inputComponent={TimerNumberFormat}
      onChange={onChange}
      placeholder="HH:MM:SS"
      fullWidth
    />
  );
}

function TimerNumberFormat(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      format="##:##:##"
    />
  );
}
