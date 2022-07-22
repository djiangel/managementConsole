import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { COLORS } from '../../styles/theme';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { isEmpty } from 'lodash';
import { Tooltip } from '@material-ui/core';

const styles = require('./DataDashboard.module.css');
const { ExportCSVButton } = CSVExport;

interface Props {
  panelProducts: any[];
  panelUsers: any[];
  panel: any;
}

const PanelProductDataQualityTable: React.FunctionComponent<Props> = ({
  panel,
  panelProducts,
  panelUsers
}) => {
  const panelEndTime = new Date(panel.endTime);
  const columns = [
    { dataField: 'id', text: 'Product ID', hidden: true, sort: true },
    { dataField: 'name', text: 'Product Name', sort: true },
    { dataField: 'reviewTotal', text: 'Total Reviews', sort: true },
    { dataField: 'totalFlags', text: 'Total Flags', sort: true },
    {
      dataField: 'percentFlagged',
      text: 'Percent Flagged',
      sort: true,
      formatter: cell => (isNaN(cell) ? '0.00' : cell)
    },
    {
      dataField: 'minimumDataMet',
      text: 'Minimum Data Met',
      formatter: ({ cleanReviews, cutOff }) => (
        <Tooltip title={minDataTooltip(cleanReviews, cutOff)}>
          <span>{cleanReviews > 0 && cleanReviews >= cutOff ? '✔' : '❌'}</span>
        </Tooltip>
      )
    }
  ];

  const minDataTooltip = (cleanReviews, cutOff) => <span>Minimum Usable Data Required: {cutOff}<br />Current Usable Data: {cleanReviews}</span>

  const rowColorCoding = (row, index) => {
    if (panelEndTime && panelEndTime < new Date()) {
      if (row.percentFlagged < 0.05) {
        return { backgroundColor: COLORS.AQUA_MARINE };
      }
      if (row.percentFlagged < 0.25) {
        return { backgroundColor: COLORS.SAFFRON };
      }
      return { backgroundColor: COLORS.CORAL_PINK };
    }

    return {
      backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
    };
  };

  let productOnePlusFlags = {};
  let productTotalFlags = {};

  panelUsers.map(user => {
    user.panelProductReviews.nodes.map(review => {
      if (isEmpty(review.dataQuality)) {
        return;
      }

      let runningFlagTotal = 0;
      let flagPresent = false;
      if (
        review.dataQuality.allGgVar ||
        review.dataQuality.buttonMashing ||
        review.dataQuality.excessiveRefFlavor ||
        review.dataQuality.ggVarMax ||
        review.dataQuality.insufficientGgVar ||
        review.dataQuality.noRefFlavor ||
        review.dataQuality.shortReviewTime
      ) {
        flagPresent = true;
      }

      if (review.dataQuality.allGgVar) runningFlagTotal += 1;
      if (review.dataQuality.buttonMashing) runningFlagTotal += 1;
      if (review.dataQuality.excessiveRefFlavor) runningFlagTotal += 1;
      if (review.dataQuality.ggVarMax) runningFlagTotal += 1;
      if (review.dataQuality.insufficientGgVar) runningFlagTotal += 1;
      if (review.dataQuality.noRefFlavor) runningFlagTotal += 1;
      if (review.dataQuality.shortReviewTime) runningFlagTotal += 1;

      if (flagPresent) {
        if (productOnePlusFlags[review.product.name]) {
          productOnePlusFlags[review.product.name] += 1;
        } else {
          productOnePlusFlags[review.product.name] = 1;
        }

        if (productTotalFlags[review.product.name]) {
          productTotalFlags[review.product.name] += runningFlagTotal;
        } else {
          productTotalFlags[review.product.name] = runningFlagTotal;
        }
      }
    });
  });

  const hasMetMinData = (productName, totalReviewCount) => {
    const flaggedReview = productOnePlusFlags[productName]
      ? productOnePlusFlags[productName]
      : 0;
    const cutOff = Math.min(totalReviewCount, 10);
    const cleanReviews = totalReviewCount - flaggedReview;

    return { cleanReviews, cutOff };
  };

  const data = panelProducts.map(panelProduct => ({
    id: panelProduct.productByProductId.id,
    name: panelProduct.productByProductId.name,
    reviewTotal: panelProduct.productReviews.totalCount,
    totalFlags: productTotalFlags[panelProduct.productByProductId.name] || 0,
    percentFlagged: productOnePlusFlags[panelProduct.productByProductId.name]
      ? (
          productOnePlusFlags[panelProduct.productByProductId.name] /
          panelProduct.productReviews.totalCount
        ).toFixed(2)
      : 0,
    minimumDataMet: hasMetMinData(
      panelProduct.productByProductId.name,
      panelProduct.productReviews.totalCount
    )
  }));

  return (
    <ToolkitProvider
      keyField="id"
      data={data}
      columns={columns}
      exportCSV
      defaultSorted={[{ dataField: 'reviewTotal', order: 'desc' }]}
      pagination={paginationFactory({
        sizePerPage: 25
      })}
      rowClasses={styles.tableRow}
      headerClasses={styles.tableHeader}
      bordered={true}
    >
      {props => (
        <div>
          <div className={styles.downloadButton}>
            <ExportCSVButton {...props.csvProps}>
              <CloudDownloadIcon color="primary" />
            </ExportCSVButton>
          </div>
          <BootstrapTable {...props.baseProps} rowStyle={rowColorCoding} />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default PanelProductDataQualityTable;
