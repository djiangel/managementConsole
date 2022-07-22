import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import BootstrapTable from 'react-bootstrap-table-next';
import { COLORS } from '../../styles/theme';
import gql from 'graphql-tag';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import UserCellEdit from './UserCellEdit';
import BlindLabelCellEdit from './BlindLabelCellEdit';
import ProductCellEdit from './ProductCellEdit';
import PanelCellEdit from './PanelCellEdit';
import PQCellEdit from './PQCellEdit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { graphql } from 'react-apollo';

interface Props {
  userId?: number;
  productId?: number;
  panelId?: number;
  result: any;
}

interface State {
  page: number;
  sizePerPage: number;
  toggle: boolean;
}

const ProductReviewsQuery = gql`
  query ProductReviewsQuery(
    $productId: Int
    $userId: Int
    $panelId: Int
    $first: Int
    $offset: Int
    $orderBy: [ProductReviewsOrderBy!]
  ) {
    reviews: allProductReviews(
      condition:{
        productId: $productId
        userId: $userId
        panelId: $panelId
      },
      first: $first
      offset: $offset
      orderBy: $orderBy
    ){
      nodes {
        id
        createdAt
        perceivedQuality
        
        user: userByUserId {
          id
          username
          email
        }
        
        product: productByProductId {
          id
          name
          brand
        }

        panel: panelByPanelId {
          id
          name
          pin
        }
        
        panelProduct: panelProductByPanelProductId {
          id
          blindLabel
        }
      }
      totalCount
    }
  }
`

let styles = require('./EditReview.module.css');

class Result extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: 25,
      toggle: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== 1 &&
      ((!isNaN(prevProps.userId) && prevProps.userId !== this.props.userId)
        || (!isNaN(prevProps.productId) && prevProps.productId !== this.props.productId)
        || (!isNaN(prevProps.panelId) && prevProps.panelId !== this.props.panelId))) {
      this.setState({ page: 1 });
    }
  }

  handleTableChange = (
    type,
    { page, sizePerPage, filters, sortField, sortOrder }
  ) => {
    const { result } = this.props;
    const currentIndex = (page - 1) * sizePerPage;
    let orderBy = 'ID_DESC';

    if(type === 'cellEdit'){
      this.setState({toggle: !this.state.toggle})
      return;
    }

    switch (sortField) {
      case 'product':
        orderBy = sortOrder === 'asc' ? 'PRODUCT_ID_ASC' : 'PRODUCT_ID_DESC';
        break;
      case 'user':
        orderBy = sortOrder === 'asc' ? 'USER_ID_ASC' : 'USER_ID_DESC';
        break;
      case 'date':
        orderBy = sortOrder === 'asc' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
        break;
      case 'pq':
        orderBy = sortOrder === 'asc' ? 'PERCEIVED_QUALITY_ASC' : 'PERCEIVED_QUALITY_DESC';
        break;
      default:
        orderBy = sortOrder === 'asc' ? 'ID_ASC' : 'ID_DESC';
    }

    result
      .fetchMore({
        variables: {
          first: sizePerPage,
          offset: currentIndex,
          orderBy: orderBy
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      })
      .then(() => this.setState({ page: page }));
  };

  render() {
    const { result } = this.props;
    const { page, sizePerPage } = this.state;

    const getData = () => {
      return result.reviews.nodes.map(node => {
        return {
          id: node.id,
          product: node.product && `${node.product.id} - ${node.product.name}`,
          user: node.user && `${node.user.id} - ${node.user.username} - ${node.user.email}`,
          date: formatDate(parseISO(node.createdAt), 'yyyy-MM-dd H:mm'),
          pq: node.perceivedQuality,
          blindLabel: node.panelProduct && node.panelProduct.blindLabel,
          panel: node.panel && `${node.panel.pin} - ${node.panel.name}`,
          panelProduct: node.panelProduct,
          panelId: node.panel && node.panel.id
        }
      })
    }

    const columns = [
      {
        dataField: 'id',
        text: 'ID',
        headerStyle: { width: '1rem' },
        hidden: true
      },
      {
        dataField: 'product',
        text: 'Product',
        headerStyle: { width: '7rem' },
        sort: true,
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
          <ProductCellEdit {...editorProps} value={value} row={row} column={column} />
        )
      },
      {
        dataField: 'user',
        text: 'User',
        headerStyle: { width: '7rem' },
        sort: true,
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
          <UserCellEdit {...editorProps} value={value} row={row} column={column} />
        )
      },
      {
        dataField: 'panel',
        text: 'Panel',
        headerStyle: { width: '7rem' },
        sort: true,
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
          <PanelCellEdit {...editorProps} value={value} row={row} column={column} />
        )
      },
      {
        dataField: 'date',
        text: 'Date',
        headerStyle: { width: '7rem' },
        sort: true,
        editable: false
      },
      {
        dataField: 'pq',
        text: 'PQ',
        headerStyle: { width: '5rem' },
        sort: true,
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
          <PQCellEdit {...editorProps} value={value} row={row} column={column} />
        )
      },
      {
        dataField: 'blindLabel',
        text: 'Blind Label',
        // headerStyle: { width: '2rem' },
        sort: true,
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
          <BlindLabelCellEdit {...editorProps} value={value} row={row} column={column} />
        )
      },
      {
        dataField: 'panelProduct',
        hidden: true,
        text: "Panel Product"
      },
      {
        dataField: 'panelId',
        hidden: true
      }
    ]


    if (result.loading) {
      return <LinearProgress />;
    }

    if (result.error) {
      return <h4>Can't load reviews!</h4>
    }


    return (
      <div>
        {!result.loading && result.reviews &&
          <BootstrapTable
            keyField="id"
            data={getData()}
            columns={columns}
            bootstrap4
            remote
            rowStyle={(_, index) => ({
              backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
            })}
            rowClasses={styles.tableRow}
            headerClasses={styles.tableHeader}
            noDataIndication={() => 'No results'}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'dbclick' })}
            onTableChange={this.handleTableChange}
            pagination={paginationFactory({
              totalSize: result.reviews.totalCount,
              sizePerPage,
              page: page,
              // onPageChange: (page) => this.loadMore(page)
            })}
          />
        }
      </div>
    );
  }
}

export default graphql(ProductReviewsQuery, {
  options: (props: any) => ({
    variables: {
      userId: props.userId ? props.userId : undefined,
      productId: props.productId ? props.productId : undefined,
      panelId: props.panelId ? props.panelId : undefined,
      first: 25,
      orderBy: 'ID_DESC'
    },
    notifyOnNetworkStatusChange: true
  }),
  name: 'result'
})(Result);