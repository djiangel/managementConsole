import React from 'react';

import FieldTextInput from '../FieldTextInput';

export default function RenderTextField(props) {
  const { input, meta, ...rest } = props;

  return <FieldTextInput input={input} meta={meta} fullWidth {...rest} />;
}
