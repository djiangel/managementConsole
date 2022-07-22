import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: any
};

const LayoutMetricsGroup = ({ children, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>{children}</StyledContainerDiv>
);

LayoutMetricsGroup.displayName = 'LayoutMetricsGroup';

export default LayoutMetricsGroup;
