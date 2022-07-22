import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: React$Element | React$Element[]
};

const TextIntentGo = ({ children, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    <div className="textWrapper">{children}</div>
    <div className="arrow" />
  </StyledContainerDiv>
);

TextIntentGo.displayName = 'TextIntentGo';

export default TextIntentGo;
