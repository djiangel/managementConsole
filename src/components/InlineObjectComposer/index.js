import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  active: boolean,
  children: React$Element,
  headerText: string
};

const InlineObjectComposer = ({
  active,
  children,
  headerText,
  ...rest
}: Props) => (
  <StyledContainerDiv {...rest}>
    {active && <div className="backdrop" />}
    <div className="body">
      <div className="header">
        <span className="headerText">{headerText}</span>
      </div>
      <div className="childrenWrapper">{children}</div>
    </div>
  </StyledContainerDiv>
);

InlineObjectComposer.displayName = 'InlineObjectComposer';

export default InlineObjectComposer;
