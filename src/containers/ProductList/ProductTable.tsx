import * as React from 'react';
import { Link, RouteProps } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
  Input,
  InputAdornment,
  LinearProgress,
  Paper
} from '../../material/index';
import { Image, Search as SearchIcon } from '@material-ui/icons';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import i18n from '../../i18n';
import formatPath from '../../utils/formatPath';
import { PRODUCT, PRODUCT_CREATE } from '../../constants/routePaths';
import { WithTranslation } from 'react-i18next';
import MaterialButton from 'components/MaterialButton';
import { foldersToTree } from '../../utils/folderHelper';
import { COLORS } from '../../styles/theme';
import { get } from 'lodash';
import ProductSearch from '../../components/ProductSearch';
import { event } from 'react-ga';
import { CAT_PRODUCT_LIST } from '../../constants/googleAnalytics/categories';
import {
  VIEW_PRODUCT_FROM_TABLE,
  SEARCH_PRODUCT,
  PRODUCT_PAGE_PREV,
  PRODUCT_PAGE_NEXT
} from '../../constants/googleAnalytics/actions';
import { getDebouncedEventFn } from '../../utils/googleAnalyticsHelper';

const styles = require('./ProductTable.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';

const debouncedEvent = getDebouncedEventFn(1000);

interface Props extends RouteProps {
  productResults?: any;
  producerId?: number;
  productTablePage?: number;
  folderResults: any;
  productFolderId: number;
  changeProductTablePage: (page: number) => void;
}

export default class ProductTable extends React.Component<
  Props & WithTranslation
> {
  state = {
    searchString: '',
    showSearch: false,
    sizePerPage: 25,
    data: [],
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false,
    orderBy: 'ID_DESC'
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
    // Refetch product query when component is mounted
    if (this.props.productTablePage != 1) {
      this.props.changeProductTablePage(1);
    }
    this.props.productResults
      .refetch()
      .then(({ errors }) => errors && console.log(errors));

    if (
      get(this.props.productResults, 'products.nodes') &&
      !this.state.data.length
    ) {
      this.setState(
        {
          ...this.state,
          data: this.getFormattedProductData()
        },
        () => {
          const item = document.querySelector(
            '.restore-' + this.props.location.state
          );
          if (item) item.scrollIntoView();
        }
      );
    }

    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.productResults !== this.props.productResults ||
      prevProps.productFolderId !== this.props.productFolderId
    ) {
      this.setState({
        ...this.state,
        data: this.getFormattedProductData()
      });
    }

    if (prevProps.producerId !== this.props.producerId) {
      this.setState({
        sizePerPage: 25,
        data: this.getFormattedProductData()
      });
    }

    if (
      prevState.searchString !== this.state.searchString ||
      prevState.showSearch !== this.state.showSearch
    ) {
      if (this.state.searchString.length > 0 && this.state.showSearch)
        document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'unset';
    }
  }

  componentWillUnmount(): void {
    document.body.style.overflow = 'unset';

    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  getFormattedProductData = () => {
    const { productResults, productFolderId, folderResults } = this.props;
    const folderTrees = foldersToTree(folderResults.folders);

    return (
      productResults &&
      productResults.products &&
      productResults.products.edges
        // TODO: Fix this so that it works for even async product fetching
        // Currently we comment this out as filtering of products based on folders
        // is done on query level but this means that products in sub-folders are
        // not being fetched.
        // .filter(product => {
        //   let folder = product.folderId || 0;
        //   while (true) {
        //     if (folder === productFolderId) return true;
        //     if (folder === 0) return false;
        //     folder = folderTrees[folder] && folderTrees[folder].parentId;
        //   }
        // })
        .slice(0, this.state.sizePerPage)
        .map(edge => ({
          id: edge.product.id,
          image: (
            <div className={styles.imageContainer}>
              {edge.product.productImages.totalCount ? (
                <img
                  src={edge.product.productImages.nodes[0].url}
                  alt={`${edge.product.id}_image`}
                  className={styles.image}
                />
              ) : (
                <Image className={styles.image} />
              )}
            </div>
          ),
          name: (
            <Link
              key={edge.product.id}
              className={`restore-${edge.product.id}`}
              to={{
                pathname: formatPath(PRODUCT, { productId: edge.product.id }),
                state: edge.product.id
              }}
              onClick={() =>
                event({
                  category: CAT_PRODUCT_LIST,
                  action: VIEW_PRODUCT_FROM_TABLE,
                  label: edge.product.id.toString()
                })
              }
            >
              {edge.product.name}
            </Link>
          ),
          brand: edge.product.brand,
          date: formatDate(parseISO(edge.product.createdAt), DATE_FORMAT),
          category:
            edge.product.productCategory && edge.product.productCategory.name,
          panel: edge.product.panelProducts.nodes
            .map(
              panelProduct =>
                panelProduct && panelProduct.panel && panelProduct.panel.pin
            )
            .join(', '),
          reviews: edge.product.productReviews.totalCount,
          lastReview:
            get(edge.product, 'productReviews.nodes.length') > 0
              ? formatDate(
                  parseISO(edge.product.productReviews.nodes[0].createdAt),
                  DATE_FORMAT
                )
              : ''
        }))
    );
  };

  handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    if (type === 'sort') {
      switch (sortField) {
        case 'name':
          this.setState(() => ({
            orderBy: sortOrder === 'asc' ? 'NAME_ASC' : 'NAME_DESC'
          }));
          break;

        case 'brand':
          this.setState(() => ({
            orderBy: sortOrder === 'asc' ? 'BRAND_ASC' : 'BRAND_DESC'
          }));
          break;

        case 'date':
          this.setState({
            orderBy: sortOrder === 'asc' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC'
          });
          break;

        default:
          this.setState({
            orderBy: sortOrder === 'asc' ? 'ID_ASC' : 'ID_DESC'
          });
      }
    }

    setTimeout(() => {
      const {
        productResults,
        producerId,
        changeProductTablePage,
        productTablePage
      } = this.props;
      const { orderBy } = this.state;
      // const currentIndex = (page - 1) * sizePerPage;

      const variables: Record<string, any> = {
        condition: { producerId, visibility: true },
        orderBy
      };

      const totalPages = Math.ceil(
        productResults.products.totalCount / sizePerPage
      );

      // For last page
      if (page === totalPages) {
        variables.last =
          productResults.products.totalCount % sizePerPage || sizePerPage;
        variables.first = undefined;

        // First Page
      } else if (page === 1) {
        variables.first = sizePerPage;

        // Pages Before
      } else if (page < productTablePage) {
        variables.before = productResults.products.pageInfo.startCursor;
        variables.last = (productTablePage - page) * sizePerPage;
        variables.first = undefined;
        // Pages After
      } else if (page > productTablePage) {
        variables.after = productResults.products.edges[sizePerPage - 1].cursor;
        variables.first = sizePerPage;
        variables.offset = (page - productTablePage - 1) * sizePerPage;
      }

      // Handling size change
      if (sizePerPage !== this.state.sizePerPage) {
        variables.first = sizePerPage;
        page = 1;
      }

      productResults
        .fetchMore({
          variables,
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return fetchMoreResult;
          }
        })
        .then(() =>
          this.setState(
            {
              sizePerPage
            },
            () => {
              changeProductTablePage(page);
              page != productTablePage && event({
                category: CAT_PRODUCT_LIST,
                action: page > productTablePage ? PRODUCT_PAGE_NEXT : PRODUCT_PAGE_PREV,
                value: Math.abs(page - productTablePage)
              })
            }
          )
        );
    }, 1000);
  };

  render() {
    const {
      productResults,
      productTablePage,
      folderResults,
      producerId,
      t
    } = this.props;

    const { data, sizePerPage, searchString } = this.state;

    if (!producerId) return <div />;

    // if (productResults.loading || folderResults.loading) {
    //   return <LinearProgress />;
    // }

    if (productResults.error || folderResults.error) {
      return <div>ERROR: Unable to fetch data!</div>;
    }

    const columns = [
      {
        dataField: 'id',
        text: 'Product ID',
        sort: true,
        hidden: true
      },
      {
        dataField: 'image',
        text: i18n.t('general.image'),
        hidden: this.state.widthBelow1400
      },
      {
        dataField: 'name',
        text: i18n.t('product.productName'),
        sort: true
      },
      {
        dataField: 'brand',
        text: i18n.t('product.productBrand'),
        sort: true,
        hidden: this.state.widthBelow600
      },
      {
        dataField: 'date',
        text: i18n.t('general.dateCreated'),
        sort: true,
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'category',
        text: i18n.t('product.productCategory'),
        hidden: this.state.widthBelow700
      },
      {
        dataField: 'panel',
        text: i18n.t('product.panels'),
        classes: styles.panelColumn,
        hidden: this.state.widthBelow1100
      },
      {
        dataField: 'reviews',
        text: i18n.t('reviews.reviews'),
        hidden: this.state.widthBelow800
      },
      {
        dataField: 'lastReview',
        text: i18n.t('reviews.lastReview'),
        hidden: this.state.widthBelow900
      }
    ];

    return (
      <ToolkitProvider
        keyField="id"
        data={producerId ? data : []}
        columns={columns}
      >
        {props => (
          <Paper className={styles.container}>
            <div className={styles.headerContainer}>
              <div className={styles.headerTextContainer}>
                <h5 className={styles.productHeader}>
                  {t('navigation.products')}
                </h5>
                <h3 className={styles.productTitle}>{t('product.gallery')}</h3>
              </div>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                onChange={event => {
                  this.setState({
                    ...this.state,
                    searchString: event.target.value,
                    showSearch: true
                  });
                  debouncedEvent({
                    category: CAT_PRODUCT_LIST,
                    action: SEARCH_PRODUCT,
                    label: event.target.value
                  });
                }}
                placeholder={t('general.search')}
              />
              <Link to={PRODUCT_CREATE}>
                <MaterialButton variant="outlined" soft teal>
                  {t('product.createProduct')}
                </MaterialButton>
              </Link>
            </div>
            {searchString.length > 0 &&
              this.state.showSearch && (
                <ProductSearch
                  query={searchString}
                  hideSearch={this.hideSearch}
                  first={10}
                />
              )}
            {productResults.loading || folderResults.loading ? (
              <LinearProgress />
            ) : (
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                remote
                pagination={paginationFactory({
                  totalSize: productResults.products.totalCount,
                  sizePerPage,
                  page: productTablePage ? productTablePage : 1
                })}
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                })}
                rowClasses={styles.tableRow}
                headerClasses={styles.tableHeader}
                noDataIndication={() => 'No results'}
                bordered={false}
                onTableChange={this.handleTableChange}
              />
            )}
          </Paper>
        )}
      </ToolkitProvider>
    );
  }
}
