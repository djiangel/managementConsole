import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { withTranslation, WithTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import selectWorkspaceProducerId from 'selectors/workspaceProducerId';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import AllProductSearchQuery from '@graphql/queries/AllProductSearchQuery';
import { get } from 'lodash';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import formatPath from '../../utils/formatPath';
import { PRODUCT } from '../../constants/routePaths';
import { COLORS } from '../../styles/theme';
import MaterialButton from '../MaterialButton';

interface Props {
	query: string;
	data?: any;
	producerId?: number;
	first: number;
  hideSearch: () => any;
  onClick?: any;
}

interface State {
  count: number;
}

const styles = require('./AllProductSearch.module.css');

class AllProductSearch extends React.Component<Props & WithTranslation, State> {
  node = null;
  
  constructor (props){
    super(props);
    this.state = {
      count: props.first,
    }
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

	productNameFormatter = (cell, row) => {
    if(this.props.onClick){
      return <a className={styles.link} onClick={() => this.props.onClick(row)}>{cell}</a>
    }
    return <Link className={styles.link} to={{ pathname: formatPath(PRODUCT, { productId: row.id }) }}>{cell}</Link>
  }

	getProductData = () => {
		const { data } = this.props;
		const products = get(data, 'productResults.nodes', []);
    return products.map(product => ({
      id: product.id,
      image:
        get(product, 'productImages.totalCount') > 0 &&
        product.productImages.nodes[0].url,
      name: product.name,
      brand: product.brand,
      date: moment(product.createdAt).format('ll'),
      reviews: get(product, 'productReviews.totalCount'),
      lastReview:
        get(product, 'productReviews.nodes.length') > 0
          ? moment(product.productReviews.nodes[0].createdAt).format('ll')
          : '',
      category: product.category,
      workspace: product.producer.name,
      productWorkspaceId: product.producer.id,
      productWorkspaceName: product.producer.name
    }));
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
          count: that.state.count + fetchMoreResult.productResults.nodes.length
        });
        return Object.assign({}, prev, {
          productResults: {
            nodes: [...prev.productResults.nodes,
            ...fetchMoreResult.productResults.nodes]
          },
          ...fetchMoreResult
        });
      }
    })
  }

	render() {
		const { t, data, first, onClick } = this.props;

    const columns = [
      {
        dataField: 'id',
        text: 'Product ID',
        sort: true,
        hidden: true
      },
      {
        dataField: 'image',
        text: t('general.image'),
        formatter: this.productImageFormatter,
        hidden: !!onClick
      },
      {
        dataField: 'name',
        text: t('product.productName'),
        formatter: this.productNameFormatter,
        sort: true
      },
      {
        dataField: 'brand',
        text: t('product.productBrand'),
        sort: true
      },
      {
        dataField: 'date',
        text: t('general.dateCreated'),
        sort: true
      },
      {
        dataField: 'reviews',
        text: t('reviews.reviews')
      },
      {
        dataField: 'workspace',
        text: "Workspace"
      },
      {
        dataField: 'lastReview',
        text: t('reviews.lastReview')
      },
      {
        dataField: 'category',
        text: 'Category',
        hidden: true
      }
    ];

		if (data.loading) return <div />;

		return (
      <div ref={node => (this.node = node)}>
        <ToolkitProvider keyField="id" columns={columns} data={this.getProductData()}>
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
                {data.productResults.totalCount > data.productResults.nodes.length && 
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={()=>this.onFetchMore(data.productResults.nodes.length + first)}
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
	graphql(AllProductSearchQuery, {
		options: ({ query, producerId, first }: Props) => ({
			variables: {
				query,
				producerId,
        first: first
			}
		})
	})
)(AllProductSearch);
