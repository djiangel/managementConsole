import * as React from 'react';
import { LinearProgress, Input, InputAdornment, List } from '../../material/index';
import { Search as SearchIcon } from '@material-ui/icons';
import UserWorkspaceListQuery from '../../graphql/queries/UserWorkspaceListQuery';
import { useQuery } from 'react-apollo-hooks';
import { useTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { COLORS } from '../../styles/theme';

interface Props {
  email: string;
}

let styles = require('./UserWorkspaceList.module.css');

const Result = ({ email }: Props) => {
  const { loading, error, data } = useQuery(UserWorkspaceListQuery, {
    variables: {
      email: email
    }
  });
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
    return data.user.producerUsersByUserId.nodes.map(node => {
      return {
        id: node.producer.id,
        name: node.producer.name
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

  if (data.user === null) {
    return <h4>User not found!</h4>;
  }

  return (
    <ToolkitProvider keyField="id" data={getData()} columns={columns} search>
      {props => (
        <div>
          <List>
            <div className={styles.headerContainer}>
              <h4>
                {data &&
                  data.user &&
                  data.user.producerUsersByUserId.totalCount}{' '}
                {t('admin.workspaces')}
              </h4>
              <MySearch {...props.searchProps} />
            </div>
          </List>
          {!loading &&
            data &&
            data.user && (
              <BootstrapTable
                keyField="id"
                data={getData()}
                columns={columns}
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
