import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { COLORS } from '../../styles/theme';

const styles = require('./DataDashboard.module.css');

interface Props {
  panelProducts: any[];
  panelists: any[];
}

const PanelContingencyTable: React.FunctionComponent<Props> = ({
  panelProducts,
  panelists
}) => {
  const products = panelProducts.map(product => ({
    productId: product.productByProductId.id,
    name: product.productByProductId.name
  }));

  const panelistProducts = panelists.map(panelist => {
    const userId = panelist.id;
    const email = panelist.email;

    const reviewedProducts = panelist.panelProductReviews.nodes.map(
      review => review.productId
    );
    return {
      userId,
      email,
      reviewedProducts
    };
  });

  const columns = [
    { dataField: 'user', text: 'User ID', sort: true },
    // here we create each column using product ID
    ...products.map(product => ({
      dataField: product.productId,
      text: product.name,
      sort: true,
      style: row =>
        row === '✅'
          ? { backgroundColor: COLORS.AQUA_MARINE }
          : { backgroundColor: COLORS.CORAL_PINK }
    }))
  ];

  const data = panelistProducts.map(panelist => {
    const result = {
      user: panelist.email
    };

    // using product id as a property in the result object and assign it a checkmark if user completed that review
    panelist.reviewedProducts.forEach(product => (result[product] = '✅'));

    return result;
  });

  return (
    <BootstrapTable
      keyField="id"
      columns={columns}
      data={data}
      defaultSorted={[{ dataField: 'reviewTotal', order: 'desc' }]}
      pagination={paginationFactory({
        sizePerPage: 25
      })}
      rowStyle={(_, index) => ({
        backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
      })}
      rowClasses={styles.tableRow}
      headerClasses={styles.tableHeader}
      bordered={true}
    />
  );
};

export default PanelContingencyTable;
