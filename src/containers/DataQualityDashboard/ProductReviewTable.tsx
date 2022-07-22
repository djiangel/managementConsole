import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { get } from 'lodash';
import { COLORS } from '../../styles/theme';

const styles = require('./DataDashboard.module.css');

interface Props {
  panelist: any;
}

const ProductReviewTable: React.FunctionComponent<Props> = ({ panelist }) => {
  const reviews = get(panelist, 'panelProductReviews.nodes', []).map(
    review => ({
      id: get(review, 'product.id', ''),
      productName: get(review, 'product.name', ''),
      ...get(review, 'dataQuality', {})
    })
  );

  const columnStyle = (row, datafield) => {
    if (row[datafield]) {
      return styles.redColumn;
    }
  };

  const columns = [
    { dataField: 'id', text: 'Product ID', hidden: true },
    {
      dataField: 'productName',
      text: 'Product Name',
      sort: true
    },
    {
      dataField: 'allGgVar',
      text: 'All 24 GGVar Marked',
      classes: (cell, row) => columnStyle(row, 'allGgVar')
    },
    {
      dataField: 'ggVarMax',
      text: 'Marked GGVars All 5',
      classes: (cell, row) => columnStyle(row, 'ggVarMax')
    },
    {
      dataField: 'noRefFlavor',
      text: 'No Reference Flavors Marked',
      classes: (cell, row) => columnStyle(row, 'noRefFlavor')
    },
    {
      dataField: 'insufficientGgVar',
      text: '<= 3 GGVar Marked',
      classes: (cell, row) => columnStyle(row, 'insufficientGgVar')
    },
    {
      dataField: 'excessiveRefFlavor',
      text: '> 40 Reference Flavors Marked',
      classes: (cell, row) => columnStyle(row, 'excessiveRefFlavor')
    },
    {
      dataField: 'shortReviewTime',
      text: 'Review Time < 30 seconds',
      classes: (cell, row) => columnStyle(row, 'shortReviewTime')
    },
    {
      dataField: 'buttonMashing',
      text: 'Button Mashing',
      classes: (cell, row) => columnStyle(row, 'buttonMashing')
    }
  ];

  return (
    <div
      style={{ backgroundColor: 'white', padding: '20px 10px', width: '60%' }}
    >
      <h3 className={styles.panelTitle}>{panelist.userIdentification}</h3>
      <BootstrapTable
        bootstrap4
        keyField="id"
        columns={columns}
        rowStyle={(_, index) => ({
          backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
        })}
        data={reviews}
        bordered
        noDataIndication={() => 'No Data Currently'}
      />
    </div>
  );
};

export default ProductReviewTable
