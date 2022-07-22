import React from 'react';
import {
  StyledContainerDiv,
  menuItemActiveClassName,
  menuItemClassName
} from './StyledComponents';

type Props = {
  renderItems: (params: {
    activeClassName: string,
    className: string
  }) => ?React$Element
};

const HorizontalTabMenu = ({ renderItems, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    {renderItems({
      activeClassName: menuItemActiveClassName,
      className: menuItemClassName
    })}
  </StyledContainerDiv>
);

HorizontalTabMenu.displayName = 'HorizontalTabMenu';

export default HorizontalTabMenu;
