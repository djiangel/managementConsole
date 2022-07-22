import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: React$Element | React$Element[]
};

const Panel = ({ children, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>{children}</StyledContainerDiv>
);

Panel.displayName = 'Panel';

export default Panel;
