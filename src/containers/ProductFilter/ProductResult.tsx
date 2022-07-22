import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import { getFormValues } from 'redux-form';
import { PRODUCT_FILTER_FORM } from '../../constants/formNames';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useQuery } from 'react-apollo-hooks';
import { labelObjectsToValue } from '../../utils/sagaHelper';
import { COLORS } from '../../styles/theme';
import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';
import { Link } from 'react-router-dom';
import formatPath from '../../utils/formatPath';
import { isEmpty, concat } from 'lodash';
import gql from 'graphql-tag';
import { PRODUCT } from '../../constants/routePaths';
import MaterialButton from '../../components/MaterialButton';
import TagModal from './TagModal';
import useStyles from './useStyles';
import { useTranslation } from 'react-i18next';

const styles = require('./ProductFilter.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';

const FilteredProductsQuery = gql`
  query FilteredProductsQuery(
    $orderBy: [ProductsOrderBy!]
    $condition: ProductCondition
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
    $filter: ProductFilter
  ) {
    products: allProducts(
      orderBy: $orderBy
      condition: $condition
      first: $first
      last: $last
      after: $after
      before: $before
      offset: $offset
      filter: $filter
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      nodes {
        id
        name
        brand
        createdAt
        producerId

        features: productFeatureProductsByProductId {
          nodes {
            id
            feature: productFeatureByProductFeatureId {
              id
              name
            }
          }
        }

        componentBases: productComponentBaseProductsByProductId {
          nodes {
            id
            componentBase: productComponentBaseByProductComponentBaseId {
              id
              name
            }
          }
        }

        componentOthers: productComponentOtherProductsByProductId {
          nodes {
            id
            componentOther: productComponentOtherByProductComponentOtherId {
              id
              name
            }
          }
        }

        productCategory: productCategoryByCategoryId {
          id
          name
        }

        producer: producerByProducerId {
          id
          name
        }

        productReviews: productReviewsByProductId {
          totalCount
        }
      }
    }
  }
`;

const getIncludedValues = values => {
  const filtered = values.filter(v => !v.out);
  return filtered.length > 0 ? filtered : undefined;
};
const getExcludedValues = values => {
  const filtered = values.filter(v => !!v.out);
  return filtered.length > 0 ? filtered : undefined;
};

const productNameFormatter = (cell, row) => (
  <Link
          key={row.id}
          className={`restore-${row.id}`}
          to={{
            pathname: formatPath(PRODUCT, { productId: row.id }),
            state: row.id
          }}
        >
          {cell}
        </Link>
);

export const ProductResult = ({ values, change, savedProducts }) => {
  const [sizePerPage, setSizePerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [orderField, setOrderField] = useState('id');
  const [orderDir, setOrderDir] = useState('desc');
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles({});
  const { t } = useTranslation();

  const columns = [
    {
      dataField: 'id',
      text: 'Product ID',
      sort: true,
      hidden: true
    },
    {
      dataField: 'name',
      text: t('product.productName'),
      sort: true,
      formatter: productNameFormatter
    },
    {
      dataField: 'brand',
      text: t('product.productBrand'),
      sort: true
    },
    {
      dataField: 'date',
      text: t('general.dateCreated'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'workspace',
      text: t('general.workspace'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'category',
      text: t('product.productCategory'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'feature',
      text: t('product.productFeature'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'componentBase',
      text: t('product.productComponentBase'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'componentOther',
      text: t('product.productComponentOther'),
      sort: true,
      csvExport: false
    },
    {
      dataField: 'reviews',
      text: t('reviews.reviews'),
      csvExport: false
    },
    {
      dataField: 'checkbox',
      text: '',
      csvExport: false,
      headerFormatter: (column, index, components) => (
        <FormControlLabel
          control={<Checkbox />}
          color="secondary"
          onClick={event => event.stopPropagation()}
          onFocus={event => event.stopPropagation()}
          onChange={event => {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
              change('selectedProducts', [...productResults.products.nodes]);
            } else {
              change('selectedProducts', []);
            }
          }}
          checked={
            values.selectedProducts.length ===
            productResults.products.nodes.length
          }
          label={'Select All'}
          classes={{ label: classes.label, root: classes.label }}
        />
      )
    }
  ];

  const filter = savedProducts
    ? {
        id: {
          in: savedProducts
        }
      }
    : {
        ingredients: values.ingredients && {
          like: `%${values.ingredients}%`
        },
        country:
          values.country && values.country.length > 0
            ? {
                in: labelObjectsToValue(getIncludedValues(values.country)),
                notIn: labelObjectsToValue(getExcludedValues(values.country))
              }
            : undefined,
        countryOfPurchase:
          values.countryOfPurchase && values.countryOfPurchase.length > 0
            ? {
                in: labelObjectsToValue(
                  getIncludedValues(values.countryOfPurchase)
                ),
                notIn: labelObjectsToValue(
                  getExcludedValues(values.countryOfPurchase)
                )
              }
            : undefined,
        producerId:
          values.workspaces && values.workspaces.length > 0
            ? {
                in: labelObjectsToValue(getIncludedValues(values.workspaces)),
                notIn: labelObjectsToValue(getExcludedValues(values.workspaces))
              }
            : undefined,
        physicalState:
          values.physicalState && values.physicalState.length > 0
            ? {
                in: labelObjectsToValue(
                  getIncludedValues(values.physicalState)
                ),
                notIn: labelObjectsToValue(
                  getExcludedValues(values.physicalState)
                )
              }
            : undefined,
        productCategoryByCategoryId:
          values.categories && values.categories.length > 0
            ? {
                name: {
                  in: labelObjectsToValue(getIncludedValues(values.categories)),
                  notIn: labelObjectsToValue(
                    getExcludedValues(values.categories)
                  )
                }
              }
            : undefined,
        productFeatureProductsByProductId:
          values.features && values.features.length > 0
            ? {
                some: getIncludedValues(values.features)
                  ? {
                      productFeatureByProductFeatureId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.features)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.features)
                  ? {
                      productFeatureByProductFeatureId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.features)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined,
        productComponentBaseProductsByProductId:
          values.componentBases && values.componentBases.length > 0
            ? {
                some: getIncludedValues(values.componentBases)
                  ? {
                      productComponentBaseByProductComponentBaseId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.componentBases)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.componentBases)
                  ? {
                      productComponentBaseByProductComponentBaseId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.componentBases)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined,
        productComponentOtherProductsByProductId:
          values.componentOthers && values.componentOthers.length > 0
            ? {
                some: getIncludedValues(values.componentOthers)
                  ? {
                      productComponentOtherByProductComponentOtherId: {
                        name: {
                          in: labelObjectsToValue(
                            getIncludedValues(values.componentOthers)
                          )
                        }
                      }
                    }
                  : undefined,
                every: getExcludedValues(values.componentOthers)
                  ? {
                      productComponentOtherByProductComponentOtherId: {
                        name: {
                          notIn: labelObjectsToValue(
                            getExcludedValues(values.componentOthers)
                          )
                        }
                      }
                    }
                  : undefined
              }
            : undefined
      };

  // Clear undefined objects
  Object.keys(filter).forEach(
    key => (filter[key] === undefined ? delete filter[key] : {})
  );

  const { loading, data: productResults, refetch } = useQuery(
    FilteredProductsQuery,
    {
      variables: {
        first: sizePerPage,
        filter: !isEmpty(filter) ? filter : undefined,
        orderBy: 'ID_DESC'
      }
    }
  );

  const handleTableChange = (
    type,
    { page: newPage, sizePerPage: newSize, sortField, sortOrder }
  ) => {
    let newOrderBy = 'ID_ASC';
    if (type === 'sort') {
      switch (sortField) {
        case 'name':
          newOrderBy = sortOrder === 'asc' ? 'NAME_ASC' : 'NAME_DESC';
          break;

        case 'brand':
          newOrderBy = sortOrder === 'asc' ? 'BRAND_ASC' : 'BRAND_DESC';
          break;

        case 'date':
          newOrderBy =
            sortOrder === 'asc' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
          break;
        case 'id':
          newOrderBy = sortOrder === 'asc' ? 'ID_ASC' : 'ID_DESC';
          break;
        default:
          setOrderField(sortField);
          setOrderDir(sortOrder);
          return;
      }
    }

    const variables: any = {
      condition: {
        visibility: true
      },
      orderBy: newOrderBy
    };

    if (newPage > page) {
      variables.before = undefined;
      variables.after = productResults.products.pageInfo.endCursor;
    } else if (newPage < page) {
      variables.after = undefined;
      variables.before = productResults.products.pageInfo.startCursor;
    } else if (newSize !== sizePerPage || orderField !== newOrderBy) {
      variables.first = newSize;
      variables.after = undefined;
      variables.before = undefined;
      newPage = 1;
    }

    refetch(variables).then(() => {
      setPage(newPage);
      setSizePerPage(newSize);
      setOrderDir(sortOrder);
      setOrderField(sortField);
      change('selectedProducts', []);
    });
  };

  if (loading) {
    return <LinearProgress />;
  }

  const data =
    productResults &&
    productResults.products &&
    productResults.products.nodes.map(node => ({
      id: node.id,
      name: node.name,
      brand: node.brand,
      date: formatDate(parseISO(node.createdAt), DATE_FORMAT),
      workspace: node.producer && node.producer.name,
      category: node.productCategory && node.productCategory.name,
      feature:
        node.features &&
        node.features.nodes.map(f => f.feature.name).join(', '),
      componentBase:
        node.componentBases &&
        node.componentBases.nodes.map(cb => cb.componentBase.name).join(', '),
      componentOther:
        node.componentOthers &&
        node.componentOthers.nodes.map(co => co.componentOther.name).join(', '),
      reviews: node.productReviews.totalCount,
      checkbox: (
        <Checkbox
          color="secondary"
          onClick={event => event.stopPropagation()}
          onFocus={event => event.stopPropagation()}
          onChange={event => {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
              change('selectedProducts', concat(values.selectedProducts, node));
            } else {
              change(
                'selectedProducts',
                values.selectedProducts.filter(val => val.id != node.id)
              );
            }
          }}
          checked={!!values.selectedProducts.find(val => val.id == node.id)}
        />
      )
    }));

  if (
    orderField !== 'name' &&
    orderField !== 'brand' &&
    orderField !== 'date' &&
    orderField !== 'id'
  ) {
    data.sort(
      (a, b) =>
        (a[orderField] || '').localeCompare(b[orderField] || '') *
        (orderDir === 'asc' ? 1 : -1)
    );
  }

  return (
    <div>
      <TagModal
        products={productResults.products}
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
      <div className={styles.resultHeader}>
        <MaterialButton teal soft onClick={() => setOpenModal(true)}>
          {t('admin.updateProductMetadata')}
        </MaterialButton>
        <div>
          {t('product.productsFound', {
            count: productResults.products.totalCount
          })}
        </div>
      </div>

      <ToolkitProvider
        keyField="id"
        data={data}
        columns={columns}
        exportCSV={{
          fileName: `Product_List.csv`
        }}
      >
        {props => (
          <React.Fragment>
            <CSVExport.ExportCSVButton
              className={styles.icon}
              {...props.csvProps}
            >
              <img
                src={require('../../../public/assets/panel_search/Download.svg')}
                alt="download-icon"
              />
              <span className={styles.iconText}>{t('general.download')}</span>
            </CSVExport.ExportCSVButton>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              remote
              pagination={paginationFactory({
                totalSize: productResults.products.totalCount,
                sizePerPage,
                paginationSize: 1,
                page,
                withFirstAndLast: false
              })}
              rowStyle={(_, index) => ({
                backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
              })}
              rowClasses={styles.tableRow}
              headerClasses={styles.tableHeader}
              noDataIndication={() => 'No results'}
              bordered={false}
              onTableChange={handleTableChange}
              sort={{ dataField: orderField, order: orderDir }}
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    </div>
  );
};

const mapStateToProps = state => ({
  values: getFormValues(PRODUCT_FILTER_FORM)(state)
});

export default connect(mapStateToProps)(ProductResult);
