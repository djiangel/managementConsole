import * as React from 'react';
import {
  StyledContainerDiv,
  menuSectionClassName,
  notificationSectionClassName
} from './StyledComponents';
import  Avatar from '@material-ui/core/Avatar';
import  IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import NotificationsNoneTwoTone from '@material-ui/icons/NotificationsNoneTwoTone';
import Badge from '@material-ui/core/Badge';
import { useQuery } from 'react-apollo-hooks';
import { ReactElement } from 'react';
import useStyles from './useStyles';
import UserNotificationsQuery from '../../graphql/queries/UserNotificationsQuery';

interface Props {
  onClickCloseMenu: () => any;
  onClickOpenMenu: () => any;
  onClickCloseNotification: () => any;
  onClickOpenNotification: () => any;
  menuIsOpen: boolean;
  notificationIsOpen: boolean;
  renderMenuContents: (
    params: {
      menuSectionClassName: string;
    }
  ) => ReactElement[];
  renderNotificationContents: (
    params: {
      notificationSectionClassName: string;
    }
  ) => any;
  viewerId?: number;
  viewerEmail?: string;
  viewerName?: string;
  viewerIsAuthenticated: boolean;
  workspaceProducerId?: number;
}

const AppViewerMenu: React.FunctionComponent<Props> = props => {
  const {
    onClickCloseMenu,
    onClickOpenMenu,
    onClickCloseNotification,
    onClickOpenNotification,
    menuIsOpen,
    notificationIsOpen,
    renderMenuContents,
    renderNotificationContents,
    viewerId,
    viewerEmail,
    viewerName,
    viewerIsAuthenticated,
    workspaceProducerId,
    ...rest
  } = props;

  const classes = useStyles();
  const { loading, error, data } = useQuery(UserNotificationsQuery, {
    variables: {
      producerId: workspaceProducerId,
      active: true
    }
  });

  const totalNotifications =
    data &&
    data.notifications &&
    Array.isArray(data.notifications.nodes) &&
    data.notifications.nodes.length;

  if (!viewerIsAuthenticated) {
    return null;
  }

  return (
    <StyledContainerDiv {...rest}>
      {menuIsOpen && (
        <div className="backdrop" onClick={onClickCloseMenu} tabIndex={-1} />
      )}
      {notificationIsOpen && (
        <div
          className="backdrop"
          onClick={onClickCloseNotification}
          tabIndex={-1}
        />
      )}
      <div className="notificationIcon">
        <IconButton
          className="toggleNotificationIsOpenButton"
          onClick={
            notificationIsOpen
              ? onClickCloseNotification
              : () => {
                  onClickOpenNotification();
                  onClickCloseMenu();
                }
          }
          tabIndex={-1}
        >
          <Badge color="secondary" badgeContent={totalNotifications}>
            <NotificationsNoneTwoTone
              style={{ fontSize: 32, color: 'white' }}
            />
          </Badge>
        </IconButton>
        <div className={`notificationWrapper ${notificationIsOpen && 'open'}`}>
          <div className="notification">
            {renderNotificationContents({
              notificationSectionClassName
            })}
          </div>
        </div>
      </div>

      <div className="relativeWrapper">
        <a
          className="toggleMenuIsOpenButton"
          onClick={
            menuIsOpen
              ? onClickCloseMenu
              : () => {
                  onClickOpenMenu();
                  onClickCloseNotification();
                }
          }
          tabIndex={-1}
        >
          <Avatar
            src={require('../../../public/assets/my_profile.png')}
            className={classes.root}
          />
          <span className="usernameText">{viewerName}</span>
          <KeyboardArrowDown color="secondary" />
        </a>
        <div className={`menuWrapper ${menuIsOpen && 'open'}`}>
          <div className="menu">
            {renderMenuContents({
              menuSectionClassName
            })}
          </div>
        </div>
      </div>
    </StyledContainerDiv>
  );
};

AppViewerMenu.displayName = 'AppViewerMenu';

export default AppViewerMenu;
