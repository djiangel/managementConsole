import * as React from 'react';
import * as moment from 'moment';
import { LinearProgress, Tooltip } from '@material-ui/core';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { COLORS } from '../../styles/theme';
import formatPath from '../../utils/formatPath';
import { USER } from '../../constants/routePaths';
import dataQualityMetrics from 'constants/dataQualityMetrics';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import AllPanelistsQuery from '@graphql/queries/AllPanelistsQuery';
import { useState } from 'react';

const styles = require('./PanelUser.module.css');

interface Props {
  data: any;
  workspaceId: number;
  filter: any;
}

const PanelUserList: React.FunctionComponent<Props> = ({
  data,
  workspaceId,
  filter
}) => {
  const { t } = useTranslation();
  const { loading } = data;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState({
    order: 'desc',
    column: 'lastActive',
    key: 'LAST_ACTIVE_DESC'
  });

  const pageLength = 10;
  const totalSize = get(data, 'panelists.totalCount', 0);

  const columns = [
    {
      dataField: 'id',
      text: 'User ID',
      hidden: true
    },
    {
      dataField: 'username',
      sort: true,
      text: t('users.username')
    },
    {
      dataField: 'totalReviews',
      text: t('users.totalReviews')
    },
    {
      dataField: 'allGgVar',
      text: (
        <Tooltip title={t('dataQuality.tooltip.allGgVar')}>
          <span>All GGVar Marked</span>
        </Tooltip>
      )
    },
    {
      dataField: 'ggVarMax',
      text: (
        <Tooltip title={t('dataQuality.tooltip.maxGgVar')}>
          <span>Max GGVar</span>
        </Tooltip>
      )
    },
    {
      dataField: 'insufficientGgVar',
      text: (
        <Tooltip title={t('dataQuality.tooltip.insufficientGgVar')}>
          <span>{'< 4 GGVar'}</span>
        </Tooltip>
      )
    },
    {
      dataField: 'noRefFlavor',
      text: (
        <Tooltip title={t('dataQuality.tooltip.noReferenceFlavor')}>
          <span>No Reference Flavors</span>
        </Tooltip>
      )
    },
    {
      dataField: 'excessiveRefFlavor',
      text: (
        <Tooltip title={t('dataQuality.tooltip.excessiveReferenceFlavor')}>
          <span>{'> 40 Reference Flavors'}</span>
        </Tooltip>
      )
    },
    {
      dataField: 'shortReviewTime',
      text: (
        <Tooltip title={t('dataQuality.tooltip.fastReview')}>
          <span>{'Review Time < 30 Seconds'}</span>
        </Tooltip>
      )
    },
    {
      dataField: 'buttonMashing',
      text: (
        <Tooltip title={t('dataQuality.tooltip.buttonMashing')}>
          <span>Button Mashing</span>
        </Tooltip>
      )
    },
    {
      dataField: 'lastActive',
      text: t('users.lastActive'),
      sort: true,
      formatter: cell => (cell ? moment(cell).format('LL') : 'N.A')
    },
    {
      dataField: 'poorReviewCount',
      text: 'Poor Reviews'
    },
    {
      dataField: 'avgFlagAll',
      text: 'Average Flag (All)'
    },
    {
      dataField: 'avgFlagRecent',
      text: 'Average Flag (Recent)'
    }
  ];

  const getFlagPercentage = reviewData => {
    const { nodes: reviews, totalCount } = reviewData;
    let flagCount = 0;

    reviews.forEach(({ dataQuality }) => {
      if (dataQuality !== null) {
        dataQualityMetrics.forEach(metric => {
          if (dataQuality[metric]) {
            flagCount++;
          }
        });
      }
    });

    return flagCount / totalCount;
  };

  const getDqdMetrics = reviewData => {
    const { nodes: reviews, totalCount } = reviewData;
    let flags = {};
    let totalFlagCount = 0;
    let poorReviewCount = 0;

    dataQualityMetrics.forEach(metric => {
      flags[metric] = 0;
    });

    reviews.forEach(({ dataQuality }) => {
      let reviewFlagCount = 0;
      if (dataQuality !== null) {
        dataQualityMetrics.forEach(metric => {
          if (dataQuality[metric]) {
            flags[metric]++;
            totalFlagCount++;
            reviewFlagCount++;
          }
        });
      }

      // If review has more than 3 flag, increment poor review count
      if (reviewFlagCount >= 3) {
        poorReviewCount++;
      }
    });

    const metrics = Object.keys(flags);
    metrics.forEach(metric => {
      flags[metric] = formatMetric(flags[metric], totalCount);
    });

    return {
      ...flags,
      poorReviewCount: formatMetric(poorReviewCount, totalCount),
      flagPercentage: (totalFlagCount / totalCount).toFixed(2)
    };
  };

  const formatMetric = (flagCount, totalCount) => {
    if (!flagCount || !totalCount) {
      return '-';
    } else {
      return `${flagCount} (${((flagCount / totalCount) * 100).toFixed(0)}%)`;
    }
  };

  const formattedData = get(data, 'panelists.edges', []).map(
    ({ node: user }) => {
      const currentFlags: any = getDqdMetrics(user.productReviews);

      return {
        id: user.id,
        username: (
          <Link to={formatPath(USER, { username: user.username })}>
            {user.username || user.email}
          </Link>
        ),
        totalReviews: get(user, 'productReviews.totalCount'),
        lastActive: user.lastActive,
        allGgVar: currentFlags.allGgVar,
        ggVarMax: currentFlags.ggVarMax,
        insufficientGgVar: currentFlags.insufficientGgVar,
        noRefFlavor: currentFlags.noRefFlavor,
        excessiveRefFlavor: currentFlags.excessiveRefFlavor,
        shortReviewTime: currentFlags.shortReviewTime,
        buttonMashing: currentFlags.buttonMashing,
        poorReviewCount: currentFlags.poorReviewCount,
        avgFlagAll:
          get(user, 'productReviews.totalCount', 0) > 0
            ? currentFlags.flagPercentage
            : '-',
        avgFlagRecent:
          get(user, 'recentReviews.totalCount', 0) > 0
            ? getFlagPercentage(user.recentReviews).toFixed(2)
            : '-'
      };
    }
  );

  const getSortKey = (column, columnKey) => {
    const newSortKey = {
      column: column,
      order: '',
      key: ''
    };

    if (column === sortKey.column) {
      if (sortKey.order === 'asc') {
        newSortKey.order = 'desc';
        newSortKey.key = `${columnKey}_DESC`;
        return newSortKey;
      }
    }
    newSortKey.order = 'asc';
    newSortKey.key = `${columnKey}_ASC`;
    return newSortKey;
  };

  const updateTableData = (page, sizePerPage, sort) => {
    const variables: Record<string, any> = {
      workspaceId,
      filter,
      recentDate: moment()
        .subtract(30, 'days')
        .toISOString(),
      orderBy: [sort.key, 'ID_ASC']
    };

    const totalPages = totalSize / sizePerPage;

    if (page === totalPages) {
      variables.last = totalSize % sizePerPage || sizePerPage;
      variables.first = undefined;
    } else if (page === 1) {
      variables.first = sizePerPage;
    } else if (page < currentPage) {
      variables.before = data.panelists.pageInfo.startCursor;
      variables.last = (currentPage - page) * sizePerPage;
      variables.first = undefined;
    } else if (page > currentPage) {
      variables.after = data.panelists.edges[sizePerPage - 1].cursor;
      variables.first = sizePerPage;
      variables.offset = (page - currentPage - 1) * sizePerPage;
    }

    data
      .fetchMore({
        variables,
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        }
      })
      .then(() => setCurrentPage(sortKey.key !== sort.key ? 1 : page), 1000);
  };

  const handleTableChange = (type, { page, sizePerPage, sortField }) => {
    let newSortKey = sortKey;
    if (type === 'sort') {
      switch (sortField) {
        case 'username':
          newSortKey = getSortKey('username', 'USERNAME');
          break;
        default:
          newSortKey = getSortKey('lastActive', 'LAST_ACTIVE');
      }
    }

    setSortKey(newSortKey);
    updateTableData(page, sizePerPage, newSortKey);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <BootstrapTable
      keyField="id"
      bordered={false}
      columns={columns}
      data={formattedData}
      rowStyle={(_, index) => ({
        backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
      })}
      rowClasses={styles.tableRow}
      headerClasses={styles.tableHeader}
      pagination={paginationFactory({
        totalSize,
        sizePerPage: pageLength,
        page: currentPage,
        hideSizePerPage: true
      })}
      bootstrap4
      remote
      onTableChange={handleTableChange}
    />
  );
};

export default compose(
  graphql(AllPanelistsQuery, {
    options: ({ workspaceId, filter }: any) => ({
      variables: {
        first: 10,
        workspaceId,
        recentDate: moment()
          .subtract(30, 'days')
          .toISOString(),
        filter,
        orderBy: ['LAST_ACTIVE_DESC', 'ID_ASC']
      },
      notifyOnNetworkStatusChange: true
    })
  })
)(PanelUserList);
