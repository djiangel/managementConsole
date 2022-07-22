import * as React from 'react';
import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useQuery } from 'react-apollo-hooks';
import { COLORS } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import UserDemographicListQuery from '../../graphql/queries/UserDemographicListQuery';
import {
  Paper,
  Input,
  InputAdornment,
  LinearProgress,
  IconButton
} from '../../material/index';
import { Search as SearchIcon } from '@material-ui/icons';
import { renderRaceAndEthnicity } from '../UserList/userTableConfig';

const styles = require('./UserDemographicList.module.css');

const columnStyle = cell =>
  !!cell ? {} : { backgroundColor: 'var(--coral-pink)' };

const UserDemographicList = () => {
  const [sizePerPage, setSizePerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [orderField, setOrderField] = useState('id');
  const [orderDir, setOrderDir] = useState('desc');
  const [searchString, setSearchString] = useState('');
  const [filterString, setFilterString] = useState('');
  const { t } = useTranslation();

  const columns = [
    {
      dataField: 'id',
      text: 'User ID',
      sort: true,
      hidden: true
    },
    {
      dataField: 'username',
      sort: true,
      text: t('users.username')
    },
    {
      dataField: 'email',
      text: t('users.email'),
      sort: true
    },
    {
      dataField: 'phoneNumber',
      text: t('users.phoneNumber'),
      sort: true
    },
    {
      dataField: 'dateOfBirth',
      text: t('users.dateOfBirth'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'firstLanguage',
      text: t('users.firstLanguage'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'race',
      text: t('users.raceEthnicity'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'gender',
      text: t('users.gender'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'smoke',
      text: t('users.smoke'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'country',
      text: t('users.country'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'nationalIdentity',
      text: t('users.nationalIdentity'),
      sort: true,
      style: columnStyle
    },
    {
      dataField: 'dietaryRestrictions',
      text: t('users.dietaryRestrictions'),
      sort: true,
      style: columnStyle
    }
  ];

  const { loading, data: userResults, refetch } = useQuery(
    UserDemographicListQuery,
    {
      variables: {
        first: sizePerPage,
        orderBy: 'ID_DESC',
        filter: !!filterString
          ? {
              or: [
                {
                  username: {
                    includesInsensitive: filterString
                  }
                },
                {
                  email: {
                    includesInsensitive: filterString
                  }
                }
              ]
            }
          : undefined
      }
    }
  );

  const handleTableChange = (
    type,
    { page: newPage, sizePerPage: newSize, sortField, sortOrder }
  ) => {
    let newOrderBy = 'ID_DESC';
    if (type === 'sort') {
      switch (sortField) {
        case 'username':
          newOrderBy = sortOrder === 'asc' ? 'USERNAME_ASC' : 'USERNAME_DESC';
          break;
        case 'email':
          newOrderBy = sortOrder === 'asc' ? 'EMAIL_ASC' : 'EMAIL_DESC';
          break;
        case 'phoneNumber':
          newOrderBy =
            sortOrder === 'asc' ? 'PHONE_NUMBER_ASC' : 'PHONE_NUMBER_DESC';
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
      orderBy: newOrderBy
    };

    if (newPage > page) {
      variables.before = undefined;
      variables.after = userResults.allUsers.pageInfo.endCursor;
    } else if (newPage < page) {
      variables.after = undefined;
      variables.before = userResults.allUsers.pageInfo.startCursor;
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
    });
  };

  if (loading) {
    return <LinearProgress />;
  }

  const data =
    userResults &&
    userResults.allUsers &&
    userResults.allUsers.nodes.map(node => ({
      id: node.id,
      username: node.username,
      email: node.email,
      name: node.name,
      phoneNumber: node.phoneNumber,
      dateOfBirth: node.dateOfBirth,
      ethnicity: node.ethnicity,
      firstLanguage: node.firstLanguage,
      gender: node.gender,
      race: renderRaceAndEthnicity(node.race),
      smoke: node.smoke,
      hometown: node.hometown,
      country: node.country,
      nationalIdentity: node.nationalIdentity,
      dietaryRestrictions: node.dietaryRestrictions,
      province: node.province,
      city: node.city,
      educationalAttainment: node.educationalAttainment
    }));

  if (
    orderField !== 'name' &&
    orderField !== 'id' &&
    orderField !== 'username' &&
    orderField !== 'email' &&
    orderField !== 'phoneNumber'
  ) {
    data.sort(
      (a, b) =>
        (a[orderField] || '').localeCompare(b[orderField] || '') *
        (orderDir === 'asc' ? 1 : -1)
    );
  }

  return (
    <Paper className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h5 className={styles.userHeader}>{t('navigation.users')}</h5>
          <h3 className={styles.userTitle}>{t('users.usersAdmin')}</h3>
        </div>
        <Input
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setFilterString(searchString)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          onChange={event => setSearchString(event.target.value)}
          value={searchString}
          placeholder={t('general.search')}
          onKeyPress={e => e.key === 'Enter' && setFilterString(searchString)}
        />
      </div>
      <div>
        <ToolkitProvider keyField="id" data={data} columns={columns}>
          {props => (
            <React.Fragment>
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                remote
                pagination={paginationFactory({
                  totalSize: userResults.allUsers.totalCount,
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
    </Paper>
  );
};

export default UserDemographicList;
