import React from 'react';
import { BubbleSpinLoader } from 'react-css-loaders';
import { StyledContainerDiv } from './StyledComponents';

export default () => (
  <StyledContainerDiv>
    <BubbleSpinLoader color="#bdbdbd" duration={0.6} size={5} />
  </StyledContainerDiv>
);
