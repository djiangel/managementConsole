import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: any,
  title: ?string
};

const Metric = ({ children, title, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    <div className="title">{title}</div>
    <div className="contentContainer">{children}</div>
  </StyledContainerDiv>
);

Metric.displayName = 'Metric';

export default Metric;
