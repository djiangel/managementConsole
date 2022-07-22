import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Paper } from '../../material/index';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import AllDemographicTargetQuery from '../../graphql/queries/AllDemographicTargetQuery';
import { COLORS } from '../../styles/theme';
import MaterialButton from '../MaterialButton';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

interface Props {
	query: string;
  demographics?: any;
	producerId?: number;
	first: number;
  hideSearch: () => any;
  onClick?: any;
}

interface State {
  demographicCount: number;
}

const styles = require('./DemographicTargetSearch.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';


class DemographicTargetSearch extends React.Component<Props & WithTranslation, State> {
  node = null;
  
  constructor (props){
    super(props);
    this.state = {
      demographicCount: props.first,
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

	projectNameFormatter = (cell, row) => {
    if(this.props.onClick){
      return <a className={styles.link} onClick={() => this.props.onClick(row)}>{cell}</a>
    }
  }

	getReportsData = () => {
		const { demographics } = this.props;

    return demographics && demographics.demographicTargets && demographics.demographicTargets.nodes &&
    demographics.demographicTargets.nodes.map(demographic => ({
      id: demographic.id,
      name: demographic.name,
      date: formatDate(parseISO(demographic.createdAt), DATE_FORMAT),
      selectedCountries: demographic.countries,
      selectedAges: demographic.ages,
      selectedEthnicities: demographic.ethnicities,
      selectedGenders: demographic.genders,
      selectedSmokingHabits: demographic.smokingHabits,
      selectedSocioEcon: demographic.socioEcon,
      selectedRegionTarget: demographic.regionTarget
    }))
  }

  onFetchMore = (count) => {
    var that = this;
    this.props.demographics.fetchMore({
      variables:{
        first: count
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        that.setState({
          demographicCount: that.state.demographicCount + fetchMoreResult.demographiCount.nodes.length
        });
        return Object.assign({}, prev, {
          demographicTargets: {
            nodes: [...prev.demographicTargets.nodes,
            ...fetchMoreResult.demographicTargets.nodes]
          },
          ...fetchMoreResult
        });
      }
    });
  }

	render() {
		const { 
      t, 
      demographics,
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
      {
        dataField: 'selectedSmokingHabits',
        hidden: true
      },
      {
        dataField: 'selectedSocioEcon',
        hidden: true
      },
      {
        dataField: 'selectedRegionTarget',
        hidden: true
      },
    ];

		if(demographics.loading){
      return <div />
    }

    const currTotalCount = demographics.demographicTargets.nodes.length;
    const totalCount = demographics.demographicTargets.totalCount
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
                    currTotalCount + first,
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
	graphql(AllDemographicTargetQuery, {
		options: ({ query, producerId, first }: Props) => ({
			variables: {
				condition: {
          producerId: producerId
        },
        first: first,
        filter: {
          name: {
            includesInsensitive: query
          }
        }
			}
    }),
    name: 'demographics'
  }),
)(DemographicTargetSearch);
