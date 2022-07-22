import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search as SearchIcon } from '@material-ui/icons';
import AllWorkspacesQuery from '../../graphql/queries/AllWorkspacesQuery';
import { useQuery } from 'react-apollo-hooks';
import { useTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { COLORS } from '../../styles/theme';

let styles = require('./AllWorkspaceList.module.css');

const Result = () => {
  const { loading, error, data } = useQuery(AllWorkspacesQuery);
  const { t } = useTranslation();
  const MySearch = props => {
    return (
      <Input
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        onChange={event => props.onSearch(event.target.value)}
        placeholder={t('general.search')}
      />
    );
  };

  const getData = () => {
    return data.allProducers.nodes.map(node => {
      return {
        id: node.id,
        name: node.name
      };
    });
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      headerStyle: { width: '1rem' }
    },
    {
      dataField: 'name',
      text: 'Name',
      headerStyle: { width: '7rem' },
      sort: true
    }
  ];

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <h4>Can't load workspaces!</h4>;
  }

  return (
    <ToolkitProvider keyField="id" data={getData()} columns={columns} search>
      {props => (
        <div>
          <List>
            <div className={styles.headerContainer}>
              <h4>
                {data && data.allProducers && data.allProducers.totalCount}{' '}
                {t('admin.workspaces')}
              </h4>
              <MySearch {...props.searchProps} />
            </div>
          </List>
          {!loading &&
            data &&
            data.allProducers && (
              <BootstrapTable
                bootstrap4
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                })}
                rowClasses={styles.tableRow}
                headerClasses={styles.tableHeader}
                noDataIndication={() => 'No results'}
                bordered={false}
                pagination={paginationFactory()}
                {...props.baseProps}
              />
            )}
        </div>
      )}
    </ToolkitProvider>
  );
};

export default Result;
