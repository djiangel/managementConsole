import * as React from 'react';
import { ReactElement } from 'react';
import {
  iconClassName,
  linkClassName,
  linkActiveClassName,
  textClassName,
  accessoryClassName,
  StyledContainerDiv
} from './StyledComponents';

interface Props {
  renderItems: (
    params: {
      activeClassName: string;
      className: string;
      iconClassName: string;
      textClassName: string;
      accessoryClassName: string;
    }
  ) => ReactElement;
}

const AppVerticalNavigationMenu: React.FunctionComponent<Props> = ({ renderItems, ...rest }) => (
  <StyledContainerDiv {...rest}>
    {renderItems({
      activeClassName: linkActiveClassName,
      className: linkClassName,
      iconClassName,
      textClassName,
      accessoryClassName
    })}
  </StyledContainerDiv>
);

AppVerticalNavigationMenu.displayName = 'AppVerticalNavigationMenu';

export default AppVerticalNavigationMenu;
