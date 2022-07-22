import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children?: React$Element | React$Element[],
  title?: string
};

const LayoutGroup = ({ children, title, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    {!!title && <div className="title">{title}</div>}
    {!!children && <div className="childrenWrapper">{children}</div>}
  </StyledContainerDiv>
);

LayoutGroup.defaultProps = {
  children: null,
  title: null
};
LayoutGroup.displayName = 'LayoutGroup';

export default LayoutGroup;
