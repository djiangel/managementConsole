import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {
  Paper,
  LinearProgress,
  IconButton,
  Input,
  InputAdornment
} from '../../material/index';
import { Search as SearchIcon, HighlightOffOutlined } from '@material-ui/icons';
import formatPath from '../../utils/formatPath';
import { COLORS } from '../../styles/theme';
import selectViewerUserId from '../../selectors/viewerUserId';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import UserNotificationsQuery from '../../graphql/queries/UserNotificationsQuery';
import { PRODUCT, PANEL, REPORT } from '../../constants/routePaths';
import { NOTIFICATION_TYPE_ENUM } from '../../constants/enum';
import { REPORT_TYPE_ENUM } from '../../constants/report';

const styles = require('./Notification.module.css');
const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

interface Props {
  userNotifications?: any;
  handleReadNotification: (notificationId: number) => void;
  viewerUserId: number;
  workspaceProducerId: number;
}

const Notification: React.FunctionComponent<Props> = ({
  userNotifications,
  handleReadNotification
}) => {
  const { t } = useTranslation();

  const getNotifications = () =>
    userNotifications &&
    userNotifications.notifications &&
    userNotifications.notifications.nodes &&
    userNotifications.notifications.nodes.map(notification => ({
      id: notification.id,
      item:
        notification.notificationType.notificationType ===
        NOTIFICATION_TYPE_ENUM.QUICK_CREATE_PRODUCT
          ? notification.notificationType.product.name
          : notification.notificationType.notificationType ===
            NOTIFICATION_TYPE_ENUM.COMPLETED_PANEL
            ? notification.notificationType.panel.pin
            : notification.notificationType.notificationType ===
              NOTIFICATION_TYPE_ENUM.MARKET_SURVEY_REPORT_READY
              ? notification.notificationType.marketSurveyReport.projectName
              : notification.notificationType.notificationType ===
                NOTIFICATION_TYPE_ENUM.OPTIMIZATION_REPORT_READY
                ? notification.notificationType.optimizationReport.projectName
                : null,
      message:
        notification.notificationType.notificationType ===
        NOTIFICATION_TYPE_ENUM.QUICK_CREATE_PRODUCT ? (
          <Link
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
            key={notification.notificationType.panelId}
            to={{
              pathname: formatPath(PANEL, {
                panelId: notification.notificationType.panelId
              }),
              state: notification.notificationType.panelId
            }}
          >
            {t('notification.messageCompletedPanel') +
              `${notification.notificationType.panel.pin}`}
          </Link>
        ) : notification.notificationType.notificationType ===
        NOTIFICATION_TYPE_ENUM.MARKET_SURVEY_REPORT_READY ? (
          <Link
            key={notification.notificationType.marketSurveyReportId}
            to={{
              pathname: formatPath(REPORT, {
                reportType: REPORT_TYPE_ENUM.MARKET_SURVEY,
                reportId: notification.notificationType.marketSurveyReportId
              }),
              state: notification.notificationType.marketSurveyReportId
            }}
          >
            {t(`notification.messageMarketSurveyReportReady`, {
              projectName:
                notification.notificationType.marketSurveyReport.projectName,
              demographic:
                notification.notificationType.marketSurveyReport.demographic
            })}
          </Link>
        ) : notification.notificationType.notificationType ===
        NOTIFICATION_TYPE_ENUM.OPTIMIZATION_REPORT_READY ? (
          <Link
            key={notification.notificationType.optimizationReportId}
            to={{
              pathname: formatPath(REPORT, {
                reportType: REPORT_TYPE_ENUM.OPTIMIZATION,
                reportId: notification.notificationType.optimizationReportId
              }),
              state: notification.notificationType.optimizationReportId
            }}
          >
            {t(`notification.messageOptimizationReportReady`, {
              projectName:
                notification.notificationType.optimizationReport.projectName,
              demographic:
                notification.notificationType.optimizationReport.demographic
            })}
          </Link>
        ) : (
          ''
        ),
      submitter: notification.user.name,
      sentOn: formatDate(
        parseISO(notification.notificationType.sentOn),
        DATE_FORMAT
      ),
      action:
        notification.notificationType.notificationType ===
          NOTIFICATION_TYPE_ENUM.QUICK_CREATE_PRODUCT &&
        notification.notificationType.product.updatedAt !==
          notification.notificationType.product.createdAt ? (
          <IconButton
            size="small"
            onClick={() => handleReadNotification(notification.id)}
          >
            <HighlightOffOutlined color="primary" fontSize="small" />
          </IconButton>
        ) : notification.notificationType.notificationType ===
          NOTIFICATION_TYPE_ENUM.COMPLETED_PANEL ||
        notification.notificationType.notificationType ===
          NOTIFICATION_TYPE_ENUM.MARKET_SURVEY_REPORT_READY ||
        notification.notificationType.notificationType ===
          NOTIFICATION_TYPE_ENUM.OPTIMIZATION_REPORT_READY ? (
          <IconButton
            size="small"
            onClick={() => handleReadNotification(notification.id)}
          >
            <HighlightOffOutlined color="primary" fontSize="small" />
          </IconButton>
        ) : null
    }));

  const columns = [
    {
      dataField: 'id',
      text: t('notification.notificationId'),
      sort: true,
      hidden: true
    },
    {
      dataField: 'item',
      text: t('notification.item'),
      hidden: true
    },
    {
      dataField: 'message',
      text: t('notification.message')
    },
    {
      dataField: 'submitter',
      text: t('notification.submitter'),
      headerClasses: styles.submitterColumn,
      sort: true
    },
    {
      dataField: 'sentOn',
      sort: true,
      text: t('notification.sentOn'),
      headerClasses: styles.submitterColumn
    },
    {
      dataField: 'action',
      text: t('notification.remove'),
      headerClasses: styles.actionColumn
    }
  ];

  const SearchComponent = ({ onSearch, placeholder }) => (
    <Input
      endAdornment={
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      }
      onChange={event => onSearch(event.target.value)}
      placeholder={placeholder}
    />
  );

  return (
    <Paper className={styles.container}>
      {userNotifications.loading ? (
        <LinearProgress />
      ) : (
        <ToolkitProvider
          keyField="id"
          data={getNotifications()}
          columns={columns}
          search
        >
          {props => (
            <div>
              <div className={styles.actionContainer}>
                <div className={styles.headerTextContainer}>
                  <h5 className={styles.notificationHeader}>
                    {t('notification.notificationList')}
                  </h5>
                  <h3 className={styles.notificationTitle}>
                    {t('notification.viewNotification')}
                  </h3>
                </div>
                <SearchComponent
                  {...props.searchProps}
                  placeholder={t('general.search')}
                />
              </div>
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                bordered={false}
                defaultSorted={[{ dataField: 'sentOn', order: 'desc' }]}
                pagination={paginationFactory({ sizePerPage: 10 })}
                noDataIndication={() => t('notification.noNotification')}
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY,
                  fontSize: 12,
                  fontFamily: 'OpenSans',
                  color: COLORS.MARINE,
                  wordWrap: 'break-word'
                })}
                headerClasses={styles.tableHeader}
              />
            </div>
          )}
        </ToolkitProvider>
      )}
    </Paper>
  );
};

const mapStateToProps = state => ({
  viewerUserId: selectViewerUserId(state),
  workspaceProducerId: selectWorkspaceProducerId(state)
});

const mapDispatchToProps = dispatch => ({
  handleReadNotification: notificationId =>
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: notificationId })
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(UserNotificationsQuery, {
    options: ({ workspaceProducerId }: Props) => ({
      variables: {
        producerId: workspaceProducerId,
        active: true
      }
    }),
    name: 'userNotifications'
  })
)(Notification);
