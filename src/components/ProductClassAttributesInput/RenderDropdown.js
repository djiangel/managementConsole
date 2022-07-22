import React from 'react';

import FormInputSelect from '../FormInputSelect';

export default function RenderDropdown(props) {
  const { input, ...rest } = props;

  return (
    <FormInputSelect isClearable placeholder="Select..." {...input} {...rest} />
  );
}
