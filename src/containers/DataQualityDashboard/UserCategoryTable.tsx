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
  panelUsers: any[];
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const UserCategoryTable: React.FunctionComponent<Props> = ({
  panelUsers
}) => {
  let columns: any = [
    {
      dataField: 'id',
      text: 'User ID',
      sort: true,
      style: { wordBreak: 'break-all' }
    },
    {
      dataField: 'age',
      text: 'Age',
      sort: true
    },
    {
      dataField: 'gender',
      text: 'Gender',
      sort: true
    },
    {
      dataField: 'socioEcon',
      text: 'Socioeconomic Status',
      sort: true
    },
    {
      dataField: 'userCategory',
      text: 'User Category',
      sort: true
    },
  ];

  let data = [];

  panelUsers.filter(user => {
      if (user.userCategory == null) {
          return false;
      }
      return true;
  }).map(user => {
    let age = getAge(user.dateOfBirth);
    let rowInfo = { 
        id: user.email,
        age: age,
        gender: user.gender,
        socioEcon: user.socioEconomicStatus,
        userCategory: user.userCategory
    };

    data.push(rowInfo);
  });

  if (data.length == 0) {
      return null;
  }

  return (
    <div>
    <h3 className={styles.panelTitle}>User Category</h3>
    <ToolkitProvider
      keyField="id"
      data={data}
      columns={columns}
      exportCSV
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
          <BootstrapTable 
            {...props.baseProps} 
            bootstrap4
            rowStyle={(row, rowIndex) => {
                if (row.userCategory == 'E3' ||
                    row.userCategory == 'E2' ||
                    row.userCategory == 'E1' ||
                    row.userCategory == 'D2' ||
                    row.userCategory == 'D1' ||
                    row.userCategory == 'C2' ||
                    row.userCategory == 'C1'
                    ) {
                    return { backgroundColor: 'var(--coral-pink)' }
                }
                return { backgroundColor: 'var(--aqua-marine)' }
            }}
          />
        </div>
      )}
    </ToolkitProvider>
    </div>
  );
};

export default UserCategoryTable;
