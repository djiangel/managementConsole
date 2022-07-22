import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useQuery } from 'react-apollo-hooks';
import { COLORS } from '../../../styles/theme';
import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';
import { Link } from 'react-router-dom';
import formatPath from '../../../utils/formatPath';
import gql from 'graphql-tag';
import { PRODUCT } from '../../../constants/routePaths';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import { PRODUCT_FILTER } from '../../../constants/routePaths';

const styles = require('../RequestReport.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';

const MIN_REVIEW = 1;

const ClassDBProductsQuery = gql`
  query ClassDBProductsQuery(
    $categoryIds: [Int!]!
    $productIds: [Int!]!
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
    $minReview: Int!
  ) {
    products: productsWithMinReviews(
      first: $first
      last: $last
      after: $after
      before: $before
      offset: $offset
      filter: { id: { notIn: $productIds }, categoryId: { in: $categoryIds } }
      minReview: $minReview
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

const ClassDbStatisticsQuery = gql`
  query ClassDbStatisticsQuery($categoryIds: [Int!]!, $minReview: Int!) {
    classDbStatistics(
      input: { categoryIds: $categoryIds, minReview: $minReview }
    )
  }
`;

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

export const ClassDBTable = ({ categories, productIds }) => {
  const [sizePerPage, setSizePerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [orderField, setOrderField] = useState('id');
  const [orderDir, setOrderDir] = useState('desc');
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
      csvExport: false,
      hidden: true
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
    }
  ];

  const { loading, data: productResults, fetchMore } = useQuery(
    ClassDBProductsQuery,
    {
      variables: {
        first: sizePerPage,
        categoryIds: categories.map(c => c.id),
        productIds: productIds,
        minReview: MIN_REVIEW
      }
    }
  );

  const classDbStatisticsQuery = useQuery(ClassDbStatisticsQuery, {
    variables: {
      categoryIds: categories.map(c => c.id),
      minReview: MIN_REVIEW
    }
  });

  const handleTableChange = (
    type,
    { page: newPage, sizePerPage: newSize, sortField, sortOrder }
  ) => {
    let newOrderBy = 'ID_ASC';
    if (type === 'sort') {
      switch (sortField) {
        // TODO: allow ordering of the whole set
        // case 'name':
        //   newOrderBy = sortOrder === 'asc' ? 'NAME_ASC' : 'NAME_DESC';
        //   break;

        // case 'brand':
        //   newOrderBy = sortOrder === 'asc' ? 'BRAND_ASC' : 'BRAND_DESC';
        //   break;

        // case 'date':
        //   newOrderBy =
        //     sortOrder === 'asc' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
        //   break;
        // case 'id':
        //   newOrderBy = sortOrder === 'asc' ? 'ID_ASC' : 'ID_DESC';
        //   break;
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
      variables.first = sizePerPage;
    } else if (newPage < page) {
      variables.after = undefined;
      variables.before = productResults.products.pageInfo.startCursor;
      variables.first = undefined;
      variables.last = sizePerPage;
    } else if (newSize !== sizePerPage || orderField !== newOrderBy) {
      variables.first = newSize;
      variables.after = undefined;
      variables.before = undefined;
      newPage = 1;
    }

    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      }
    }).then(() => {
      setPage(newPage);
      setSizePerPage(newSize);
      setOrderDir(sortOrder);
      setOrderField(sortField);
    });
  };

  if (!categories || categories.length <= 0)
    return (
      <div>
        <div className={styles.adminOnly}>ADMIN ONLY</div>
        <div>
          {productIds && productIds.length > 0
            ? 'The category for the products in the competitive set has not been set. To see the Class DB, set the product categories in Edit Product Page!'
            : 'Add products to the competitive set above!'}
        </div>
      </div>
    );

  if (loading || classDbStatisticsQuery.loading) {
    return <LinearProgress />;
  }

  const getStatistic = (group: string, idValue: any) => {
    try {
      const statistic =
        classDbStatisticsQuery.data.classDbStatistics[group][idValue];
      const {
        totalProduct,
        totalReview
      } = classDbStatisticsQuery.data.classDbStatistics;
      const productRatio = (
        (statistic.product_count / totalProduct) *
        100
      ).toFixed(1);
      const reviewRatio = (
        (statistic.review_count / totalReview) *
        100
      ).toFixed(1);
      return `(${statistic.product_count}, ${productRatio}%, ${
        statistic.review_count
      }, ${reviewRatio}%)`;
    } catch {
      return '(N/A)';
    }
  };

  const data =
    productResults &&
    productResults.products &&
    productResults.products.nodes.map(node => ({
      id: node.id,
      name: node.name,
      brand:
        node.brand &&
        `${node.brand} ${getStatistic('brandStatistics', node.brand)}`,
      date: formatDate(parseISO(node.createdAt), DATE_FORMAT),
      workspace: node.producer && node.producer.name,
      category:
        node.productCategory &&
        `${node.productCategory.name} ${getStatistic(
          'categoryStatistics',
          node.productCategory.id
        )}`,
      feature:
        node.features &&
        node.features.nodes
          .map(
            f =>
              `${f.feature.name} ${getStatistic(
                'featureStatistics',
                f.feature.id
              )}`
          )
          .join(', '),
      componentBase:
        node.componentBases &&
        node.componentBases.nodes
          .map(
            cb =>
              `${cb.componentBase.name} ${getStatistic(
                'componentBaseStatistics',
                cb.componentBase.id
              )}`
          )
          .join(', '),
      componentOther:
        node.componentOthers &&
        node.componentOthers.nodes
          .map(
            co =>
              `${co.componentOther.name} ${getStatistic(
                'componentOtherStatistics',
                co.componentOther.id
              )}`
          )
          .join(', '),
      reviews: node.productReviews.totalCount
    }));

  data.sort(
    (a, b) =>
      String(a[orderField] || '').localeCompare(b[orderField] || '') *
      (orderDir === 'asc' ? 1 : -1)
  );

  return (
    <div>
      <div className={styles.adminOnly}>ADMIN ONLY</div>
      <div className={styles.resultHeader}>
        <Link
          to={{
            pathname: PRODUCT_FILTER,
            state: {
              categories: categories.map(c => c.name)
            }
          }}
        >
          <MaterialButton teal soft>
            Product Filter
          </MaterialButton>
        </Link>

        <div className={styles.productFieldsTitle}>Class DB</div>

        <div>
          {t('product.productsFound', {
            count: productResults.products.totalCount
          })}
        </div>
      </div>

      <div className={styles.statisticsInfo}>
        Products in report are included in Class DB.
        <br />
        The statistics embeded in the table follow the following format:<br />
        <i>
          (<br />
          number of products under that category,<br />
          percentage of the total Class DB belonging to that category,<br />
          number of reviews under that category,<br />
          percentage of total reviews in the Class DB belonging to that category<br />
          )
        </i>
      </div>

      <ToolkitProvider keyField="id" data={data} columns={columns}>
        {props => (
          <React.Fragment>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              remote
              pagination={paginationFactory({
                totalSize: productResults.products.totalCount,
                sizePerPage,
                paginationSize: 1,
                page,
                withFirstAndLast: false,
                showTotal: true,
                paginationTotalRenderer: (from, to, size) => (
                  <span>Total Page: {Math.ceil(size / sizePerPage)}</span>
                )
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

export default ClassDBTable;
