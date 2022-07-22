import React from 'react';
import AutoSuggest from 'react-autosuggest';
import { WrappedFieldProps } from 'redux-form';

export default ({ input, meta, ...rest }: WrappedFieldProps) => (
  <AutoSuggest inputProps={input} {...rest} />
);
