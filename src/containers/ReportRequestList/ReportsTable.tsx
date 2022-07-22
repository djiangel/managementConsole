import * as React from 'react';
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
import { concat, find, sortBy, groupBy } from 'lodash';
import LoadingScreen from '../../components/LoadingScreen';
import formatPath from '../../utils/formatPath';
import { formatReportType } from '../../constants/report';

import { compose, graphql } from 'react-apollo';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import changeProductTablePage from '../../actions/changeProductTablePage';
import { connect } from 'react-redux';
import AllReportsQuery from '../../graphql/queries/AllReportsQuery';
import { IconButton } from '@material-ui/core';
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

const styles = require('./ReportsTable.module.css');

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

const debouncedEvent = getDebouncedEventFn(1000);

interface Props extends RouteProps {
  reportJobsResults?: any;
  producerId?: number;
  reportsTablePage?: number;
  changeReportsTablePage: (page: number) => void;
  toggleAdvanceSearch: Function;
}

class ReportsTable extends React.Component<Props & WithTranslation> {
  state = {
    fileLoad: false,
    sizePerPage: 25,
    page: 1,
    data: [],
    readyReportJobs: [],
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false
  };

  updateDimensions() {
    if (window.innerWidth < 625) {
      this.setState({
        widthBelow600: true
      });
    } else {
      this.setState({
        widthBelow600: false
      });
    }
    if (window.innerWidth < 700) {
      this.setState({
        widthBelow700: true
      });
    } else {
      this.setState({
        widthBelow700: false
      });
    }

    if (window.innerWidth < 800) {
      this.setState({
        widthBelow800: true
      });
    } else {
      this.setState({
        widthBelow800: false
      });
    }

    if (window.innerWidth < 900) {
      this.setState({
        widthBelow900: true
      });
    } else {
      this.setState({
        widthBelow900: false
      });
    }

    if (window.innerWidth < 1000) {
      this.setState({
        widthBelow1000: true
      });
    } else {
      this.setState({
        widthBelow1000: false
      });
    }

    if (window.innerWidth < 1100) {
      this.setState({
        widthBelow1100: true
      });
    } else {
      this.setState({
        widthBelow1100: false
      });
    }

    if (window.innerWidth < 1200) {
      this.setState({
        widthBelow1400: true
      });
    } else {
      this.setState({
        widthBelow1400: false
      });
    }
  }

  hideSearch = () => {
    this.setState({
      showSearch: false
    });
  };

  componentDidMount() {
    this.setState({
      data: this.getFormattedProductData()
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.readyReportJobs.length !== this.state.readyReportJobs.length) {
      this.setState({
        data: this.getFormattedProductData(),
        fileLoad: true
      });
    }
  }

  componentWillUnmount(): void {
    document.body.style.overflow = 'unset';

    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  getFormattedProductData = () => {
    const { reportJobsResults } = this.props;
    const { readyReportJobs } = this.state;

    const reportJobsReports =
      reportJobsResults &&
      reportJobsResults.reports &&
      reportJobsResults.reports.nodes &&
      Object.entries(
        groupBy(reportJobsResults.reports.nodes, i => i.rootId || i.id)
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
          file:
            res[0].pdfEfsUri ? (
              <a
                target="_blank"
                href={res[0].pdfEfsUri}
                title={i18n.t('reports.pdfDownload')}
              >
                { i18n.t('reports.pdfReport') }
              </a>
            ) : null
        }));

    return reportJobsReports;
  };

  render() {
    const {
      reportsTablePage,
      producerId,
      reportJobsResults,
      t
    } = this.props;

    if (!producerId) return <div />;

    const columns = [
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        hidden: true
      },
      {
        dataField: 'name',
        text: i18n.t('panel.projectName'),
        sort: true
      },
      {
        dataField: 'reportTypeDisplay',
        text: i18n.t('reports.reportType'),
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'demographic',
        text: i18n.t('reports.targetGroup'),
        hidden: this.state.widthBelow700
      },
      {
        dataField: 'user',
        text: i18n.t('reports.submitter'),
        hidden: this.state.widthBelow700
      },
      {
        dataField: 'date',
        text: i18n.t('reports.submittedOn'),
        sort: true,
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'status',
        text: i18n.t('reports.status'),
        hidden: this.state.widthBelow700,
        headerClasses: styles.smallHeader
      },
      {
        dataField: 'file',
        text: i18n.t('general.download'),
        headerClasses: styles.smallHeader
      }
    ];

    if (reportJobsResults.loading) {
      return <LoadingScreen />;
    }

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
        <IconButton onClick={() => this.props.toggleAdvanceSearch()}>
          <FilterList fontSize="small" />
        </IconButton>
      </div>
    );

    return (
      <ToolkitProvider
        keyField="key"
        data={producerId ? this.getFormattedProductData() : []}
        columns={columns}
        search
      >
        {props => (
          <Paper className={styles.container}>
            <div className={styles.headerContainer}>
              <div className={styles.headerTextContainer}>
                <h5 className={styles.productHeader}>
                  {t('navigation.reports')}
                </h5>
                <h3 className={styles.productTitle}>{t('reports.requests')}</h3>
              </div>
              <SearchComponent
                {...props.searchProps}
                placeholder={t('general.search')}
              />
              { /* TODO: Commented out 2022-06-01 dpurdy: request report button not supported with use of observable form. May come back later
              <Link
                to={REQUEST_REPORT}
                onClick={() =>
                  event({
                    category: CAT_REPORT_LIST,
                    action: REQUEST_REPORT_OPEN
                  })
                }
              >
                <MaterialButton variant="outlined" soft teal>
                  {t('reports.createReportRequest')}
                </MaterialButton>
              </Link>
              */ }
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
                        this.state.page < newPage
                          ? REPORT_LIST_PAGE_NEXT
                          : REPORT_LIST_PAGE_PREV,
                      value: Math.abs(newPage - this.state.page)
                    });
                    this.setState({ page: newPage });
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
}

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
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
)(ReportsTable);
