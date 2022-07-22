import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import { COLORS } from '../../styles/theme';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';
import { PRODUCT, PANEL_SEARCH, PANEL } from 'constants/routePaths';
import PanelSearchQuery from '@graphql/queries/PanelSearchQuery';
import formatPath from 'utils/formatPath';
import { WithTranslation, withTranslation } from 'react-i18next';
import MaterialButton from '../../components/MaterialButton';

interface Props {
  query?: string;
  data?: any;
  producerId?: number;
  isFloating?: boolean;
  first: number;
  hideSearch?: () => any;
  startTime?: Date;
  endTime?: Date;
}

interface State {
  count: number;
}

const styles = require('./PanelSearch.module.css');

class PanelSearch extends React.Component<Props & WithTranslation, State> {
  node = null;

  constructor(props) {
    super(props);
    this.state = {
      count: props.first
    };
  }

  // Add listener to close the table when it's visible
  componentDidUpdate() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = e => {
    // Clicking outside
    if (!this.node.contains(e.target)) {
      this.props.hideSearch();
    }
  };

  productNameFormatter = (cell, row) => (
    <Link
      target="_blank"
      key={row.id}
      to={formatPath(PRODUCT, { productId: row.id })}
      className={styles.productName}
    >
      {cell}
    </Link>
  );

  panelFormatter = (cell, row) => (
    <Link
      to={formatPath(PANEL, { panelId: row.panelId })}
      key={row.panelId}
      className={styles.productName}
    >
      {cell}
    </Link>
  );

  csvNullFormatter = cell => (cell === null ? '' : cell);

  getPanelData = () => {
    const { data } = this.props;

    if (!data.panelResults || data.panelResults.totalCount === 0) {
      return [];
    }

    return data.panelResults.nodes.map(node => ({
      key: `${node.id}`,
      id: node.product.id,
      productName: node.product.name,
      brandName: node.product.brand,
      date: moment(node.panel.startTime).format('ll'),
      startTime: moment(node.panel.startTime).format('LT'),
      panelId: node.panel.id,
      panelPin: node.panel.pin,
      panelName: node.panel.name
    }));
  };

  onFetchMore = count => {
    var that = this;
    this.props.data.fetchMore({
      variables: {
        first: count
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        that.setState({
          count: that.state.count + fetchMoreResult.panelResults.nodes.length
        });
        return Object.assign({}, prev, {
          panelResults: {
            nodes: [
              ...prev.panelResults.nodes,
              ...fetchMoreResult.panelResults.nodes
            ]
          },
          ...fetchMoreResult
        });
      }
    });
  };

  render() {
    const {
      query,
      isFloating,
      data,
      t,
      first,
      startTime,
      endTime
    } = this.props;
    const columns = [
      {
        dataField: 'key',
        hidden: true,
        csvExport: false
      },
      {
        dataField: 'id',
        text: 'Product ID',
        hidden: true
      },
      {
        dataField: 'productName',
        text: t('product.productName'),
        formatter: this.productNameFormatter,
        csvExport: 'Product Name'
      },
      {
        dataField: 'brandName',
        text: t('product.productBrand'),
        csvFormatter: this.csvNullFormatter,
        csvExport: 'Product Brand'
      },
      {
        dataField: 'date',
        text: t('panel.startDate'),
        csvExport: 'Start Date'
      },
      {
        dataField: 'startTime',
        text: t('panel.startTime'),
        csvExport: 'Start Time'
      },
      {
        dataField: 'panelId',
        text: 'Panel ID',
        hidden: true
      },
      {
        dataField: 'panelPin',
        text: t('panel.panelPin'),
        formatter: this.panelFormatter,
        csvExport: 'Panel PIN'
      },
      {
        dataField: 'panelName',
        text: t('panel.panelName'),
        csvFormatter: this.csvNullFormatter,
        csvExport: 'Panel Name'
      }
    ];

    if (data.loading) return <div />;

    return (
      <div ref={node => (this.node = node)}>
        <ToolkitProvider
          keyField="key"
          data={this.getPanelData()}
          columns={columns}
          exportCSV={{
            fileName: `Panel_Search_${query}.csv`
          }}
        >
          {props => (
            <Paper className={isFloating && styles.container}>
              <div className={isFloating && styles.tableContainer}>
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  rowStyle={(_, index) => ({
                    backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                  })}
                  noDataIndication={() => 'No Data'}
                  rowClasses={styles.tableRow}
                  headerClasses={styles.tableHeader}
                />
                <div style={{ textAlign: 'center', marginBottom: first }}>
                  {data.panelResults &&
                    data.panelResults.totalCount >
                      data.panelResults.nodes.length && (
                      <MaterialButton
                        variant="outlined"
                        soft
                        onClick={() =>
                          this.onFetchMore(
                            data.panelResults.nodes.length + first
                          )
                        }
                      >
                        Load More
                      </MaterialButton>
                    )}
                </div>
              </div>
              <div className={styles.iconContainer}>
                {isFloating && (
                  <Link
                    target="_blank"
                    to={formatPath(PANEL_SEARCH, {
                      query: encodeURI(query),
                      startTime: startTime && startTime.toISOString(),
                      endTime: endTime && endTime.toISOString()
                    })}
                    className={styles.icon}
                  >
                    <img
                      src={require('../../../public/assets/panel_search/View.svg')}
                      alt="view-icon"
                    />
                    <span className={styles.iconText}>{t('general.view')}</span>
                  </Link>
                )}
                <CSVExport.ExportCSVButton
                  className={styles.icon}
                  {...props.csvProps}
                >
                  <img
                    src={require('../../../public/assets/panel_search/Download.svg')}
                    alt="download-icon"
                  />
                  <span className={styles.iconText}>
                    {t('general.download')}
                  </span>
                </CSVExport.ExportCSVButton>
              </div>
            </Paper>
          )}
        </ToolkitProvider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  graphql(PanelSearchQuery, {
    options: ({ query, producerId, first, startTime, endTime }: Props) => ({
      variables: {
        query,
        producerId,
        first,
        startTime: startTime && new Date(startTime.setUTCHours(0, 0, 0, 0)),
        endTime: endTime && new Date(endTime.setUTCHours(23, 59, 59, 99))
      }
    })
  })
)(PanelSearch) as React.ComponentType<Props>;
