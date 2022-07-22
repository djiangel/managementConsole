import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

const ProgressBar = (props: Object) => (
  <StyledContainerDiv {...props}>
    <div className="value" />
    <div className="maximum" />
  </StyledContainerDiv>
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
