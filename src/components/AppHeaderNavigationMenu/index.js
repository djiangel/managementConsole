import React from 'react';
import {
  StyledContainerDiv,
  linkClassName,
  linkActiveClassName
} from './StyledComponents';

type Props = {
  renderItems: (params: {
    activeClassName: string,
    className: string
  }) => ?React$Element
};

const AppHeaderNavigationMenu = ({ renderItems, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    {renderItems({
      activeClassName: linkActiveClassName,
      className: linkClassName
    })}
  </StyledContainerDiv>
);

AppHeaderNavigationMenu.displayName = 'AppHeaderNavigationMenu';

export default AppHeaderNavigationMenu;
