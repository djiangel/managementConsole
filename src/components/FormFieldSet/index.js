import React from 'react';
import { StyledFieldSet, inputClassName } from './StyledComponents';

type Props = {
  legendText: string,
  renderInputs: (params: {
    inputClassName: string
  }) => React$Element[]
};

const FormFieldSet = ({ legendText, renderInputs, ...rest }: Props) => (
  <StyledFieldSet {...rest}>
    {!legendText && <legend>{legendText}</legend>}
    <div className="inputsWrapper">{renderInputs({ inputClassName })}</div>
  </StyledFieldSet>
);

FormFieldSet.displayName = 'FormFieldSet';

export default FormFieldSet;
