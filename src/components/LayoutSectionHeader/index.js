import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: any
};

const LayoutSectionHeader = ({ children, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>{children}</StyledContainerDiv>
);

LayoutSectionHeader.displayName = 'LayoutSectionHeader';

export default LayoutSectionHeader;
