import * as React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import AppViewerMenu from '../../components/AppViewerMenu';
import {
  ADMIN_DATA_EXPLORER,
  USER,
  LANGUAGES,
  PRODUCT,
  NOTIFICATION,
  PANEL,
  REPORT
} from '../../constants/routePaths';
import formatPath from '../../utils/formatPath';
import ConditionViewerRoleIsAdminContainer from '../ConditionViewerRoleIsAdmin';
import UserNotificationsQuery from '../../graphql/queries/UserNotificationsQuery';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import i18next from 'i18next';
import { NOTIFICATION_TYPE_ENUM } from '../../constants/enum';
import { REPORT_TYPE_ENUM } from '../../constants/report';

const styles = require('./AppHeaderViewerMenu.module.css');
const profileIcon = require('../../../public/assets/viewer_menu/profile.svg');
const adminIcon = require('../../../public/assets/viewer_menu/admin.svg');
const languageIcon = require('../../../public/assets/viewer_menu/language.svg');
const signOutIcon = require('../../../public/assets/viewer_menu/sign_out.svg');

interface Props {
  menuIsOpen: boolean;
  onClickCloseMenu: () => any;
  onClickOpenMenu: () => any;
  notificationIsOpen: boolean;
  onClickCloseNotification: () => any;
  onClickOpenNotification: () => any;
  onClickSignOut: () => any;
  viewerId?: number;
  workspaceProducerId?: number;
  viewerEmail?: string;
  viewerIsAuthenticated: boolean;
  viewerName?: string;
  viewerUsername?: string;
  viewerLanguage?: string;
  userNotifications?: any;
}

const AppViewerMenuContainer: React.FunctionComponent<Props> = ({
  menuIsOpen,
  onClickCloseMenu,
  onClickOpenMenu,
  notificationIsOpen,
  onClickCloseNotification,
  onClickOpenNotification,
  onClickSignOut,
  viewerId,
  workspaceProducerId,
  viewerEmail,
  viewerName,
  viewerIsAuthenticated,
  viewerUsername,
  viewerLanguage,
  userNotifications
}) => {
  const { t } = useTranslation();
  const numOfNotifications = 5;

  useEffect(
    () => {
      (async function setLanguage(language) {
        switch (language) {
          case 'zh':
          case 'ja':
            await i18next.changeLanguage(language);
            break;

          default:
            await i18next.changeLanguage('en');
        }
      })(viewerLanguage);
    },
    [viewerLanguage]
  );

  return (
    <AppViewerMenu
      menuIsOpen={menuIsOpen}
      onClickCloseMenu={onClickCloseMenu}
      onClickOpenMenu={onClickOpenMenu}
      notificationIsOpen={notificationIsOpen}
      onClickCloseNotification={onClickCloseNotification}
      onClickOpenNotification={onClickOpenNotification}
      renderMenuContents={({ menuSectionClassName }) => [
        <div className={menuSectionClassName} key={menuSectionClassName}>
          <div className={styles.menuContainer}>
            <div id={styles.accessory} />
            <div className={styles.textContainer}>
              <img src={profileIcon} alt="profile-icon" />
              <Link
                id={styles.menuItem}
                to={formatPath(USER, { username: viewerUsername })}
              >
                {t('viewerMenu.profile')}
              </Link>
            </div>
          </div>

          <div className={styles.menuContainer}>
            <div id={styles.accessory} />
            <div className={styles.textContainer}>
              <img src={languageIcon} alt="language-icon" />
              <Link id={styles.menuItem} to={LANGUAGES}>
                {t('viewerMenu.changeLanguage')}
              </Link>
            </div>
          </div>

          <ConditionViewerRoleIsAdminContainer
            render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) =>
              viewerRoleIsSuperadmin && (
                <div className={styles.menuContainer}>
                  <div id={styles.accessory} />
                  <div className={styles.textContainer}>
                    <img src={adminIcon} alt="admin-icon" />
                    <Link id={styles.menuItem} to={ADMIN_DATA_EXPLORER}>
                      {t('viewerMenu.adminWorkspace')}
                    </Link>
                  </div>
                </div>
              )
            }
          />

          <div className={styles.menuContainer}>
            <div id={styles.accessory} />
            <div
              className={styles.textContainer}
              style={{ borderBottom: 'none' }}
            >
              <img src={signOutIcon} alt="sign-out-icon" />
              <a id={styles.menuItem} onClick={onClickSignOut} tabIndex={-1}>
                {t('viewerMenu.signOut')}
              </a>
            </div>
          </div>
        </div>
      ]}
      renderNotificationContents={({ notificationSectionClassName }) =>
        userNotifications &&
        userNotifications.notifications &&
        userNotifications.notifications.nodes ? (
          <div
            className={notificationSectionClassName}
            key={notificationSectionClassName}
          >
            {userNotifications.notifications.nodes
              .slice(-numOfNotifications)
              .reverse()
              .map(notification => (
                <div className={styles.menuContainer}>
                  <div id={styles.accessory} />
                  <div className={styles.notificationContainer}>
                    {notification.notificationType.notificationType ===
                    NOTIFICATION_TYPE_ENUM.QUICK_CREATE_PRODUCT ? (
                      <Link
                        id={styles.menuItem}
                        key={notification.notificationType.productId}
                        to={{
                          pathname: formatPath(PRODUCT, {
                            productId: notification.notificationType.productId
                          }),
                          state: notification.notificationType.productId
                        }}
                      >
                        {t('notification.messageQuickCreateProduct') +
                          `${notification.notificationType.product.name}`}
                      </Link>
                    ) : notification.notificationType.notificationType ===
                    NOTIFICATION_TYPE_ENUM.COMPLETED_PANEL ? (
                      <Link
                        id={styles.menuItem}
                        key={notification.notificationType.panelId}
                        to={{
                          pathname: formatPath(PANEL, {
                            panelId: notification.notificationType.panelId
                          }),
                          state: notification.notificationType.productId
                        }}
                      >
                        {t('notification.messageCompletedPanel') +
                          `${notification.notificationType.panel.pin}`}
                      </Link>
                    ) : notification.notificationType.notificationType ===
                    NOTIFICATION_TYPE_ENUM.MARKET_SURVEY_REPORT_READY ? (
                      <Link
                        id={styles.menuItem}
                        key={notification.notificationType.marketSurveyReportId}
                        to={{
                          pathname: formatPath(REPORT, {
                            reportType: REPORT_TYPE_ENUM.MARKET_SURVEY,
                            reportId:
                              notification.notificationType.marketSurveyReportId
                          }),
                          state:
                            notification.notificationType.marketSurveyReportId
                        }}
                      >
                        {t(`notification.messageMarketSurveyReportReady`, {
                          projectName:
                            notification.notificationType.marketSurveyReport
                              .projectName,
                          demographic:
                            notification.notificationType.marketSurveyReport
                              .demographic
                        })}
                      </Link>
                    ) : notification.notificationType.notificationType ===
                    NOTIFICATION_TYPE_ENUM.OPTIMIZATION_REPORT_READY ? (
                      <Link
                        id={styles.menuItem}
                        key={notification.notificationType.optimizationReportId}
                        to={{
                          pathname: formatPath(REPORT, {
                            reportType: REPORT_TYPE_ENUM.OPTIMIZATION,
                            reportId:
                              notification.notificationType.optimizationReportId
                          }),
                          state:
                            notification.notificationType.optimizationReportId
                        }}
                      >
                        {t(`notification.messageOptimizationReportReady`, {
                          projectName:
                            notification.notificationType.optimizationReport
                              .projectName,
                          demographic:
                            notification.notificationType.optimizationReport
                              .demographic
                        })}
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ))}
            <div className={styles.menuContainer}>
              <div id={styles.accessory} />
              <div className={styles.allNotification}>
                <Link to={NOTIFICATION} id={styles.menuItem}>
                  {t('notification.seeAllNotifications')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.menuContainer}>
            <div id={styles.accessory} />
            <div className={styles.noNotification}>
              {t('notification.noNotification')}
            </div>
          </div>
        )
      }
      viewerId={viewerId}
      viewerEmail={viewerEmail}
      viewerName={viewerName}
      viewerIsAuthenticated={viewerIsAuthenticated}
      workspaceProducerId={workspaceProducerId}
    />
  );
};

AppViewerMenuContainer.displayName = 'AppViewerMenuContainer';

export default compose(
  graphql(UserNotificationsQuery, {
    options: ({ workspaceProducerId }: Props) => ({
      variables: {
        producerId: workspaceProducerId,
        active: true
      }
    }),
    name: 'userNotifications'
  })
)(AppViewerMenuContainer);
