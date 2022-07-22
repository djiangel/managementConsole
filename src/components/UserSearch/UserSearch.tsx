import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { withTranslation, WithTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import UserSearchInWorkspaceQuery from '@graphql/queries/UserSearchInWorkspaceQuery';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import formatPath from '../../utils/formatPath';
import { USER } from '../../constants/routePaths';
import { COLORS } from '../../styles/theme';
import { renderRaceAndEthnicity } from '../../containers/UserList/userTableConfig';
import MaterialButton from '../../components/MaterialButton';

interface Props {
	query: string;
	data?: any;
	producerId?: number;
  first: number;
  hideSearch: () => any;
}

interface State {
  count: number;
}

const styles = require('./UserSearch.module.css');

class UserSearch extends React.Component<Props & WithTranslation, State> {

  node = null;

  constructor (props){
    super(props);
    this.state = {
      count: props.first,
    }
  }

	// Add listener to close the table when it's visible
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

	getUserData = () => {
		const { data } = this.props;
		if (data && data.user){
			return data.user.nodes.map(user => ({
				id: user.id,
				username: (
					<Link key={user.id} to={formatPath(USER, { username: user.username })}>
					  {user.username}
					</Link>
				),
		    email: user.email,
				phoneNumber: user.phoneNumber,
				firstLanguage: user.firstLanguage,
				raceEthnicity:  renderRaceAndEthnicity(user.race),
				totalReviews: get(user, 'productReviews.totalCount')
			}))
		}

		return [];
    };
    
    onFetchMore = (count) => {
      var that = this;
      this.props.data.fetchMore({
        variables:{
          first: count
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          that.setState({
            count: that.state.count + fetchMoreResult.user.nodes.length
          });
          return Object.assign({}, prev, {
            user: {
              nodes: [...prev.productResults.nodes,
              ...fetchMoreResult.productResults.nodes]
            },
            ...fetchMoreResult
          });
        }
      })
    }  

	render() {
		const { t, data, first } = this.props;

    const columns = [
      {
        dataField: 'id',
        text: 'User ID',
        sort: true,
        hidden: true
      },
      {
        dataField: 'username',
        text: t('users.username')
      },
      {
        dataField: 'email',
        text: t('users.email'),
        headerStyle: { width: '20%' }
      },
      {
        dataField: 'phoneNumber',
        text: t('users.phoneNumber')
      },
      // {
      //   dataField: 'dateOfBirth',
      //   text: t('users.dateOfBirth')
      // },
      {
        dataField: 'firstLanguage',
        text: t('users.firstLanguage')
      },
      {
        dataField: 'raceEthnicity',
        text: t('users.raceEthnicity')
      },
      {
        dataField: 'totalReviews',
        text: t('users.totalReviews')
      }
    ];

		if (data.loading) return <div />;

		return (
      <div ref={node => (this.node = node)}>
        <ToolkitProvider keyField="id" columns={columns} data={this.getUserData()} >
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
                />
                <div style={{textAlign: 'center', marginBottom: first}}>
                  {data.user.totalCount > data.user.nodes.length && 
                  <MaterialButton
                    variant="outlined"
                    soft
                    onClick={()=>this.onFetchMore(data.user.nodes.length + first)}
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
	graphql(UserSearchInWorkspaceQuery, {
		options: ({ query, producerId, first }: Props) => ({
			variables: {
				query,
				producerId,
				first: first
			}
		})
	})
)(UserSearch);
