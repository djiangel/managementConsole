import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, RouteProps } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
  Input,
  InputAdornment,
  Paper
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import i18n from '../../i18n';
import { REQUEST_REPORT, REPORT } from '../../constants/routePaths';
import { withTranslation, WithTranslation } from 'react-i18next';
import MaterialButton from 'components/MaterialButton';
import { COLORS } from '../../styles/theme';
import { concat, find, sortBy, groupBy, findIndex } from 'lodash';
import Alert from 'react-s-alert';
import LoadingScreen from '../../components/LoadingScreen';
import formatPath from '../../utils/formatPath';
import { formatReportType, STATUS_ENUM } from '../../constants/report';

import { compose, graphql } from 'react-apollo';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import changeProductTablePage from '../../actions/changeProductTablePage';
import { connect } from 'react-redux';
import AllReportsQuery from '../../graphql/queries/AllReportsQuery';
import UpdateReportJob from '../../graphql/mutations/UpdateReportJob';
import graphqlClient from '../../consumers/graphqlClient';
import { IconButton, Icon } from '@material-ui/core';
import { Close, Done } from '@material-ui/icons';
import { FilterList } from '@material-ui/icons';
import { event } from 'react-ga';
import { CAT_REPORT_LIST } from 'constants/googleAnalytics/categories';
import {
  REPORT_LIST_PAGE_NEXT,
  REPORT_LIST_PAGE_PREV,
  REPORT_LIST_SEARCH,
  REPORT_LIST_VIEW_REPORT,
  REQUEST_REPORT_OPEN
} from 'constants/googleAnalytics/actions';
import { getDebouncedEventFn } from 'utils/googleAnalyticsHelper';

const styles = require('./ReportsQATable.module.css');

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

const debouncedEvent = getDebouncedEventFn(1000);

interface Props extends RouteProps {
  reportJobsResults?: any;
  producerId?: number;
  reportsTablePage?: number;
  changeReportsTablePage: (page: number) => void;
  toggleAdvanceSearch: Function;
}

const ReportsQATable: React.FC<Props & WithTranslation> = (props) => {
  const { 
    producerId,
    reportJobsResults,
    reportsTablePage, 
    changeReportsTablePage,
    t
  } = props;
  const [commonState, setCommonState] = useState({
    fileLoad: false,
    sizePerPage: 25,
    page: 1,
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [readyReportJobs, setReadyReportJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let baseData = [];

  const AlertType = {
    success: 'success',
    error: 'error'
  };

  const PageAlert = (type, message) => {
    return Alert[AlertType[type]](message, {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 4000
    });
  };

  const updateDimensions = () => {
    if (window.innerWidth < 625) {
      setCommonState({
        ...commonState,
        widthBelow600: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow600: false
      });
    }
    if (window.innerWidth < 700) {
      setCommonState({
        ...commonState,
        widthBelow700: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow700: false
      });
    }

    if (window.innerWidth < 800) {
      setCommonState({
        ...commonState,
        widthBelow800: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow800: false
      });
    }

    if (window.innerWidth < 900) {
      setCommonState({
        ...commonState,
        widthBelow900: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow900: false
      });
    }

    if (window.innerWidth < 1000) {
      setCommonState({
        ...commonState,
        widthBelow1000: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow1000: false
      });
    }

    if (window.innerWidth < 1100) {
      setCommonState({
        ...commonState,
        widthBelow1100: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow1100: false
      });
    }

    if (window.innerWidth < 1200) {
      setCommonState({
        ...commonState,
        widthBelow1400: true
      });
    } else {
      setCommonState({
        ...commonState,
        widthBelow1400: false
      });
    }
  }

  const formatAndSaveDataToState = (data) => {
      baseData = data;
      setJobs(getFormattedProductData(data));
  }

  useEffect(() => {
    // setIsLoading(true);
    if (reportJobsResults
      && !reportJobsResults.loading
      && reportJobsResults.error === undefined) {
         const loadedData = reportJobsResults &&
          reportJobsResults.reports &&
          reportJobsResults.reports.nodes;
        formatAndSaveDataToState(loadedData);
        setIsLoading(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', updateDimensions);
    }
  }, [reportJobsResults.loading]);

  const updateObjectInState = (id, status) => {
    const data = baseData;
    const dataIndex = findIndex(data, { id });
    const dataObject = data[dataIndex];
    const updateList = [...data];
    updateList[dataIndex] = { ...dataObject, passedQa: status };
    baseData = updateList;
    console.log(jobs)
    setJobs(getFormattedProductData(updateList));
  }

  const updateReportJobStatus = async (id, status) => {
    await graphqlClient.mutate({
        mutation: UpdateReportJob,
        variables: {
          id,
          reportJobPatch: { passedQa: status }
        }
      }).then(res => {
        updateObjectInState(id, status);
        return PageAlert(AlertType.success, 'Changes saved successfully');
      }).catch(() => {
        PageAlert(AlertType.error, 'Changes not saved. Please try again')
      })
  }

  const getFormattedProductData = (localData = baseData) => {
    const reportJobsReports =
      Object.entries(
        groupBy(localData, i => i.rootId || i.id)
      )
        .map(res => sortBy(res[1], [i => (isNaN(i) ? 0 : -i)]))
        .map(res => ({
          key: `ms_${res[0].id}`,
          id: res[0].id,
          reportType: res[0].reportType,
          reportTypeDisplay: formatReportType(res[0].reportType),
          user: res[0].requestedThrough,
          name: res[0].projectName,
          demographic: res[0].targetGroupName,
          date: formatDate(parseISO(res[0].startedAt), DATE_FORMAT),
          status: res[0].reportStatus,
          clientName: res[0].clientName,
          file:
            res[0].pdfEfsUri ? (
              <a
                target="_blank"
                href={res[0].pdfEfsUri}
                title={i18n.t('reports.pdfDownload')}
              >
                { i18n.t('reports.pdfReport') }
              </a>
            ) : null,
          action: isSuccessful(res[0]) ? res[0].passedQa === null ? (
            <div style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}>
              <IconButton size="small">
                <Done fontSize="small" htmlColor={COLORS.AQUA_MARINE} onClick={() => updateReportJobStatus(res[0].id, true)} />              
              </IconButton>
              <IconButton size="small">
                <Close fontSize="small" color="error" onClick={() => updateReportJobStatus(res[0].id, false)} />
              </IconButton>
            </div>
          ) : (res[0].passedQa ? i18n.t('reports.qaApproved') : i18n.t('reports.qaRejected')) : null
        })) ;
    return reportJobsReports;
  };

  function isSuccessful(reportResultRow: any): boolean {
    return reportResultRow.reportStatus && reportResultRow.reportStatus === STATUS_ENUM.SUCCESS;
  }

  const columns = [
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        hidden: true
      },
      {
        dataField: 'clientName',
        text: i18n.t('reports.workspace'),
        sort: true,
        hidden: commonState.widthBelow1000
      },
      {
        dataField: 'name',
        text: i18n.t('panel.projectName'),
        sort: true,
      },
      {
        dataField: 'reportTypeDisplay',
        text: i18n.t('reports.reportType'),
        hidden: commonState.widthBelow1000
      },
      {
        dataField: 'demographic',
        text: i18n.t('reports.targetGroup'),
        hidden: commonState.widthBelow1000
      },
      {
        dataField: 'user',
        text: i18n.t('reports.submitter'),
        hidden: commonState.widthBelow700
      },
      {
        dataField: 'date',
        text: i18n.t('reports.submittedOn'),
        sort: true,
        hidden: commonState.widthBelow1000
      },
      {
        dataField: 'dashboard',
        text: "Dashboard",
        hidden: true
      },
      {
        dataField: 'status',
        text: i18n.t('reports.status'),
        hidden: commonState.widthBelow700,
        headerClasses: styles.smallHeader
      },
      {
        dataField: 'file',
        text: i18n.t('general.download'),
        headerClasses: styles.smallHeader
      },
      {
        dataField: 'action',
        text: t('general.action'),
        headerClasses: styles.smallHeader
      }
    ];

  const SearchComponent = ({ onSearch, placeholder }) => (
    <div>
      <Input
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        onChange={event => {
          onSearch(event.target.value);
          debouncedEvent({
            category: CAT_REPORT_LIST,
            action: REPORT_LIST_SEARCH,
            label: event.target.value
          })
        }}
        placeholder={placeholder}
      />
    </div>
  );

  if (!producerId) return <div />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <ToolkitProvider
        keyField="key"
        data={producerId ? jobs : []}
        columns={columns}
        search
      >
        {props => (
          <Paper className={styles.container}>
            <div className={styles.headerContainer}>
              <div className={styles.headerTextContainer}>
                <h5 className={styles.productHeader}>
                  {t('navigation.reportsQa')}
                </h5>
                <h3 className={styles.productTitle}>{t('reports.requests')}</h3>
              </div>
              <SearchComponent
                {...props.searchProps}
                placeholder={t('general.search')}
              />
            </div>
            {
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                defaultSorted={[
                  {
                    dataField: 'date',
                    order: 'desc'
                  }
                ]}
                pagination={paginationFactory({
                  sizePerPage: 25,
                  onPageChange: newPage => {
                    event({
                      category: CAT_REPORT_LIST,
                      action:
                        commonState.page < newPage
                          ? REPORT_LIST_PAGE_NEXT
                          : REPORT_LIST_PAGE_PREV,
                      value: Math.abs(newPage - commonState.page)
                    });
                    setCommonState({ ...commonState, page: newPage });
                  }
                })}
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                })}
                rowClasses={styles.tableRow}
                headerClasses={styles.tableHeader}
                noDataIndication={() => 'No results'}
                bordered={false}
              />
            }
          </Paper>
        )}
      </ToolkitProvider>
    );
}

const mapStateToProps = commonState => ({
  producerId: selectWorkspaceProducerId(commonState)
});

const mapDispatchToProps = dispatch => ({
  changeReportsTablePage: page => dispatch(changeProductTablePage(page))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(AllReportsQuery, {
    options: (props: any) => ({
      variables: {
        filter: props.filter,
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true,
      skip: !props.reportJob
    }),
    name: 'reportJobsResults'
  }),
  withTranslation()
)(ReportsQATable);
