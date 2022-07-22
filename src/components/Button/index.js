import React from 'react';
import { StyledButton } from './StyledComponents';

type Props = {
  children: React$Element | string
};

const Button = ({ children, ...rest }: Props) => (
  <StyledButton {...rest}>{children}</StyledButton>
);

Button.displayName = 'Button';

export default Button;
