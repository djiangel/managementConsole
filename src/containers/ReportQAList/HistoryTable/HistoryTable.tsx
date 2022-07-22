import * as React from 'react';
import { Link, RouteProps } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import formatPath from '../../../utils/formatPath';
import { WithTranslation } from 'react-i18next';
import { REPORT } from '../../../constants/routePaths';
import i18n from '../../../i18n';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

const styles = require('./HistoryTable.module.css');

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

interface Props extends RouteProps {
  data?: any[];
  producerId?: number;
  userId: number;
  reportType: string;
}

export default class HistoryTable extends React.Component<
  Props & WithTranslation
  > {
  state = {
    fileLoad: false,
    sizePerPage: 25,
    data: [],
    readyMarketSurveyReports: [],
    readyOptimizationReports: [],
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false,
    marketSurveyReportId: null,
    optimizationReportId: null,
    showCommentModal: false,
    showRevisionModal: false,
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

  componentDidMount() {
    this.setState({
      data: this.getHistoryData()
    });
  }

  componentWillUnmount(): void {
    document.body.style.overflow = 'unset';

    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  getHistoryData = () => {
    const { data, userId, reportType, t } = this.props;
    return data.map(res => ({
        id: res.id,
        // versionNo: res.versionNo || 1,
        workspace: res.client,
        user: res.user.name,
        name: <Link
          key={`ms_${res.id}`}
          className={`restore-${res.id}`}
          to={{
            pathname: formatPath(REPORT, {
              reportId: res.id,
              reportType: reportType
            })
          }}
        >
          Version {res.versionNo}
        </Link>,
        demographic: res.demographic,
        date: formatDate(parseISO(res.submittedOn), DATE_FORMAT),
        status: res.status,
        file: res.file && (
          <a
            // download={`GG_Report_Download_MS_${res.id}`}
            target="_blank"
            href={res.file.blob}
            title="Download PDF"
          >
            PDF Report
          </a>
        ),
        // action:
        //   res.file &&
        //     res.status === 'In QA' ? (
        //       <React.Fragment>
        //         <IconButton
        //           size="small"
        //           onClick={() =>
        //             this.setState({
        //               showCommentModal: true,
        //               marketSurveyReportId: res.id
        //             })
        //           }
        //         >
        //           <HighlightOffOutlined color="primary" fontSize="default" />
        //         </IconButton>
        //         <IconButton
        //           size="small"
        //           onClick={() =>
        //             graphqlClient.mutate({
        //               mutation: UpdateMarketSurveyReport,
        //               variables: {
        //                 id: res.id,
        //                 patch: {
        //                   status: 'Done',
        //                 }
        //               },
        //               refetchQueries: ['AllMarketSurveyReportQuery']
        //             }) &&
        //             graphqlClient.mutate({
        //               mutation: CreateReportQaMutation,
        //               variables: {
        //                 reportQa: {
        //                   reportType: REPORT_TYPE_ENUM.MARKET_SURVEY,
        //                   userId: userId,
        //                   marketSurveyReportId: res.id,
        //                   decision: DECISION_ENUM.ACCEPT,
        //                   submittedOn: moment()
        //                 }
        //               }
        //             })
        //           }
        //         >
        //           <CheckCircleOutline color="secondary" fontSize="default" />
        //         </IconButton>
        //       </React.Fragment>
        //     ) : res.status === 'Rejected' ? (
        //       <MaterialButton
        //         variant="outlined"
        //         soft
        //         teal
        //         size="small"
        //         onClick={() =>
        //           this.setState({
        //             showRevisionModal: true,
        //             marketSurveyReportId: res.id
        //           })
        //         }
        //       >
        //         {t('reports.revise')}
        //       </MaterialButton>
        //     ) : (
        //         ''
        //       )
      }));
  };

  reportNameFormatter = (cell, row) => (
		<Link
      key={row.id}
      to={{
      pathname: formatPath(REPORT, { 
          reportId: row.id,
          reportType: row.reportType
        })
      }}
    >
      {cell}
    </Link>
	);

  render() {
    const {
      producerId,
      userId,
      t
    } = this.props;
    const {
      marketSurveyReportId,
      optimizationReportId,
      showCommentModal,
      showRevisionModal
    } = this.state;

    if (!producerId) return <div />;

    // if (productResults.error || folderResults.error) {
    //   return <div>ERROR: Unable to fetch data!</div>;
    // }

    const columns = [
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        hidden: true
      },
      {
        dataField: 'expand',
        classes: styles.expandCol
      },
      {
        dataField: 'versionNo',
        text: "Version",
        sort: true,
      },
      {
        dataField: 'name',
        text: i18n.t('panel.projectName'),
        sort: true
      },
      {
        dataField: 'demographic',
        text: i18n.t('reports.demographic'),
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'user',
        text: i18n.t('reports.submitter')
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
        classes: styles.smallHeader
      },
      {
        dataField: 'file',
        text: i18n.t('general.download'),
        hidden: this.state.widthBelow700,
        classes: styles.smallHeader
      },
      {
        dataField: 'action',
        text: t('general.action'),
        classes: styles.smallHeader
      }
    ];
    
    return (
      <>
        <ToolkitProvider
          keyField="id"
          data={producerId ? this.getHistoryData() : []}
          columns={columns}
        >
          {props => (
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              rowClasses={styles.tableRow}
              headerClasses={styles.tableHeader}
              noDataIndication={() => 'No results'}
              bordered={false}
            />
          )}
        </ToolkitProvider>
        {/* <RevisionModal
          open={showRevisionModal}
          handleClose={() =>
            this.setState({
              showRevisionModal: false,
              marketSurveyReportId: null,
              optimizationReportId: null
            })
          }
          reportType={
            marketSurveyReportId
              ? REPORT_TYPE_ENUM.MARKET_SURVEY
              : REPORT_TYPE_ENUM.OPTIMIZATION
          }
          userId={userId}
          marketSurveyReportId={marketSurveyReportId}
          optimizationReportId={optimizationReportId}
          submittedOn={moment()}
        />
        <CommentsModal
          open={showCommentModal}
          handleClose={() =>
            this.setState({
              showCommentModal: false,
              marketSurveyReportId: null,
              optimizationReportId: null
            })
          }
          reportType={
            marketSurveyReportId
              ? REPORT_TYPE_ENUM.MARKET_SURVEY
              : REPORT_TYPE_ENUM.OPTIMIZATION
          }
          userId={userId}
          marketSurveyReportId={marketSurveyReportId}
          optimizationReportId={optimizationReportId}
          decision={DECISION_ENUM.REJECT}
          submittedOn={moment()}
        /> */}
      </>
    );
  }
}
