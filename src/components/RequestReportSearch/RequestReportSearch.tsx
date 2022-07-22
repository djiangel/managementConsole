import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { withTranslation, WithTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import MarketSurveyReportSearchQuery from '../../graphql/queries/MarketSurveyReportSearchQuery';
import OptimizationReportSearchQuery from '../../graphql/queries/OptimizationReportSearchQuery';
import { get } from 'lodash';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import formatPath from '../../utils/formatPath';
import { PRODUCT } from '../../constants/routePaths';
import { COLORS } from '../../styles/theme';
import MaterialButton from '../MaterialButton';
import { concat } from 'lodash';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

interface Props {
	query: string;
  optimizationResults?: any;
  marketSurveyResults?: any;
	producerId?: number;
	first: number;
  hideSearch: () => any;
  onClick?: any;
}

interface State {
  msCount: number;
  oCount: number;
}

const styles = require('./RequestReportSearch.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';


class RequestReportSearch extends React.Component<Props & WithTranslation, State> {
  node = null;
  
  constructor (props){
    super(props);
    this.state = {
      msCount: props.first,
      oCount: props.first,
    }
  }

  rowEvents = {
    onClick: (_e, row, ) => this.props.onClick(row)
  }

	componentDidUpdate(prevProps, prevState) {
		document.addEventListener('mousedown', this.handleClick, false);
	}
	
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false);
	}

	handleClick = e => {
	// Clicking outside
		if (
			!this.node.contains(e.target)
		) {
			this.props.hideSearch()
		}
	};
	productImageFormatter = (cell, row) =>
		cell ? (
			<div className={styles.imageContainer}>
				<img src={cell} alt={`${row.id}_img`} className={styles.image} />
			</div>
		) : (
			<div />
		);

	projectNameFormatter = (cell, row) => {
    if(this.props.onClick){
      return <a className={styles.link} onClick={() => this.props.onClick(row)}>{cell}</a>
    }
  }

	getReportsData = () => {
		const { marketSurveyResults, optimizationResults } = this.props;

    const marketSurveyReports = marketSurveyResults && marketSurveyResults.marketSurveyReportResults && marketSurveyResults.marketSurveyReportResults.nodes &&
    marketSurveyResults.marketSurveyReportResults.nodes.map(res => ({
      id: `ms_${res.id}`,
      user: res.user.name,
      name: res.projectName,
      date: formatDate(parseISO(res.submittedOn), DATE_FORMAT),
      status: res.status,
      selectedCountries: res.selectedCountries,
      selectedAges: res.selectedAges,
      selectedEthnicities: res.selectedEthnicities,
      selectedGenders: res.selectedGenders,
      // selectedSmokingHabits: res.selectedSmokingHabits,
      selectedSocioEcon: res.selectedSocioEcon,
      selectedRegionTarget: res.selectedRegionTarget
    }))

    const optimizationReports = optimizationResults && optimizationResults.optimizationReportResults && optimizationResults.optimizationReportResults.nodes &&
    optimizationResults.optimizationReportResults.nodes.map(res => ({
      id: `o_${res.id}`,
      user: res.user.name,
      name: res.projectName,
      date: formatDate(parseISO(res.submittedOn), DATE_FORMAT),
      status: res.status,
      selectedCountries: res.selectedCountries,
      selectedAges: res.selectedAges,
      selectedEthnicities: res.selectedEthnicities,
      selectedGenders: res.selectedGenders,
      // selectedSmokingHabits: res.selectedSmokingHabits,
      selectedSocioEcon: res.selectedSocioEcon,
      selectedRegionTarget: res.selectedRegionTarget
    }))

    return concat(marketSurveyReports, optimizationReports);
  }

  onFetchMore = (marketSurveyCount, optimizationCount) => {
    var that = this;
    this.props.marketSurveyResults.fetchMore({
      variables:{
        first: marketSurveyCount
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        that.setState({
          msCount: that.state.msCount + fetchMoreResult.marketSurveyReportResults.nodes.length
        });
        return Object.assign({}, prev, {
          marketSurveyReportResults: {
            nodes: [...prev.marketSurveyReportResults.nodes,
            ...fetchMoreResult.marketSurveyReportResults.nodes]
          },
          ...fetchMoreResult
        });
      }
    });

    this.props.optimizationResults.fetchMore({
      variables:{
        first: optimizationCount
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        that.setState({
          oCount: that.state.oCount + fetchMoreResult.optimizationReportResults.nodes.length
        });
        return Object.assign({}, prev, {
          marketSurveyReportResults: {
            nodes: [...prev.optimizationReportResults.nodes,
            ...fetchMoreResult.optimizationReportResults.nodes]
          },
          ...fetchMoreResult
        });
      }
    })
  }

	render() {
		const { 
      t, 
      optimizationResults,
      marketSurveyResults, 
      first 
    } = this.props;

    const columns = [
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        hidden: true
      },
      {
        dataField: 'name',
        text: t('panel.projectName'),
        sort: true,
        // formatter: this.projectNameFormatter
      },
      {
        dataField: 'user',
        text: t('reports.submitter'),
      },
      {
        dataField: 'date',
        text: t('general.date'),
        sort: true
      },
      {
        dataField: 'selectedEthnicities',
        hidden: true
      },
      {
        dataField: 'selectedGenders',
        hidden: true
      },
      {
        dataField: 'selectedCountries',
        hidden: true
      },
      {
        dataField: 'selectedAges',
        hidden: true
      },
      // {
      //   dataField: 'selectedSmokingHabits',
      //   hidden: true
      // },
      {
        dataField: 'selectedSocioEcon',
        hidden: true
      },
      {
        dataField: 'selectedRegionTarget',
        hidden: true
      },
    ];

		if(optimizationResults.loading || marketSurveyResults.loading){
      return <div />
    }

    const currTotalCount = marketSurveyResults.marketSurveyReportResults.nodes.length + optimizationResults.optimizationReportResults.nodes.length;
    const totalCount = marketSurveyResults.marketSurveyReportResults.totalCount + optimizationResults.optimizationReportResults.totalCount;

		return (
      <div ref={node => (this.node = node)}>
        <ToolkitProvider keyField="id" columns={columns} data={this.getReportsData()}>
          {(props) => (
            <Paper className={styles.container}>
              <div className={styles.tableContainer}>
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  rowStyle={(_, index) => ({
                    backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                  })}
                  noDataIndication={() => 'No Data'}
                  rowClasses={styles.tableRow}
                  headerClasses={styles.tableHeader}
                  rowEvents={this.rowEvents}
                />
                <div style={{textAlign: 'center', marginBottom: first}}>
                {totalCount > currTotalCount && 
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={()=>this.onFetchMore(
                    marketSurveyResults.marketSurveyReportResults.nodes.length + first,
                    optimizationResults.optimizationReportResults.nodes.length + first
                  )}
                >Load More</MaterialButton>}
                </div>
              </div>
            </Paper>
          )}
        </ToolkitProvider>
      </div>
		);
	}
}

const mapStateToProps = (state) => ({
	producerId: selectWorkspaceProducerId(state)
});

export default compose(
	connect(mapStateToProps),
	withTranslation(),
	graphql(OptimizationReportSearchQuery, {
		options: ({ query, producerId, first }: Props) => ({
			variables: {
				query,
				producerId,
        first: first
			}
    }),
    name: 'optimizationResults'
  }),
  graphql(MarketSurveyReportSearchQuery, {
		options: ({ query, producerId, first }: Props) => ({
			variables: {
				query,
				producerId,
        first: first
			}
    }),
    name: 'marketSurveyResults'
	})
)(RequestReportSearch);
