import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: React$Element | React$Element[]
};

const PanelFooter = ({ children, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>{children}</StyledContainerDiv>
);

PanelFooter.displayName = 'PanelFooter';

export default PanelFooter;
