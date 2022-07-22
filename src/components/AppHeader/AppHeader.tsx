import * as React from 'react';
import { ReactElement } from 'react';
import { APP_ROOT } from '../../constants/routePaths';
import { StyledContainerDiv } from './StyledComponents';

interface Props {
  renderLeftItem?: () => ReactElement;
  renderNavigationMenu?: () => ReactElement;
  renderNotificationsMenu?: () => ReactElement;
  renderViewerMenu?: () => ReactElement;
}

const AppHeader: React.FunctionComponent<Props> = ({
  renderLeftItem,
  renderNavigationMenu,
  renderNotificationsMenu,
  renderViewerMenu,
  ...rest
}) => (
  <StyledContainerDiv {...rest}>
    <div className="leftItemWrapper">{renderLeftItem()}</div>
    <div className="navigationMenuWrapper">{renderNavigationMenu()}</div>
    <div className="notificationsMenuWrapper">{renderNotificationsMenu()}</div>
    <div className="viewerMenuWrapper">{renderViewerMenu()}</div>
  </StyledContainerDiv>
);

const noOp = () => null;

AppHeader.defaultProps = {
  renderLeftItem: () => (
    <a className="logo" href={APP_ROOT}>
      Gastrograph
    </a>
  ),
  renderNavigationMenu: noOp,
  renderNotificationsMenu: noOp,
  renderViewerMenu: noOp
};
AppHeader.displayName = 'AppHeader';

export default AppHeader;
