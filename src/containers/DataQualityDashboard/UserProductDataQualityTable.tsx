import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { COLORS } from '../../styles/theme';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { isEmpty } from 'lodash';

const styles = require('./DataDashboard.module.css');
const { ExportCSVButton } = CSVExport;

interface Props {
  panelProducts: any[];
  panelUsers: any[];
  latestAppBuild?: string;
}

const UserProductDataQualityTable: React.FunctionComponent<Props> = ({
  panelProducts,
  panelUsers,
  latestAppBuild
}) => {
  let columns: any = [
    {
      dataField: 'id',
      text: 'User ID',
      sort: true,
      style: { wordBreak: 'break-all' }
    }
  ];

  let data = [];

  panelUsers.map(user => {
    let rowInfo = { id: user.email || user.phoneNumber || user.id };

    user.panelProductReviews.nodes.map(review => {
      let runningFlagTotal = 0;

      if (isEmpty(review.dataQuality)) {
        return;
      }

      if (review.dataQuality.allGgVar) runningFlagTotal += 1;
      if (review.dataQuality.buttonMashing) runningFlagTotal += 1;
      if (review.dataQuality.excessiveRefFlavor) runningFlagTotal += 1;
      if (review.dataQuality.ggVarMax) runningFlagTotal += 1;
      if (review.dataQuality.insufficientGgVar) runningFlagTotal += 1;
      if (review.dataQuality.noRefFlavor) runningFlagTotal += 1;
      if (review.dataQuality.shortReviewTime) runningFlagTotal += 1;

      let columnString = runningFlagTotal.toString();

      if (latestAppBuild && review.appRevision !== latestAppBuild) {
        columnString += '\t❗';
      }

      let columnObject = {}

      if (review.dataQuality.noGgVar) {
        columnObject = {
          columnString: columnString,
          noGgVar: review.dataQuality.noGgVar.toString()
        }
      } else {
        columnObject = {
          columnString: columnString
        }
      }

      rowInfo[review.product.name] = columnObject;
    });

    data.push(rowInfo);
  });

  panelProducts.map(product => {
    let newAdd = {
      dataField: product.productByProductId.name,
      text: product.productByProductId.name,
      sort: true,
      formatter: (cell, row) => {
        if (cell != undefined) {
          return (
            <div>
              {cell.columnString && (
                <span>{cell.columnString}</span>
              )}
              <br/>
              {cell.noGgVar && (
                <span>{'No. of GGVars marked: ' + cell.noGgVar}</span>
              )}
            </div>
          )
        } else {
          return null;
        }
      }
    };
    columns.push(newAdd);
  });

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
      rowStyle={(_, index) => ({
        backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
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
          <BootstrapTable {...props.baseProps} />
          <span className={styles.refreshMsg}>
            Reviews with ❗ are completed using an older build of the app.
          </span>
        </div>
      )}
    </ToolkitProvider>
  );
};

export default UserProductDataQualityTable;
