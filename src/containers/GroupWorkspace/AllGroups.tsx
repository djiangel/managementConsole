import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { getFormValues } from 'redux-form';
import { GROUP_PRODUCER_FORM } from '../../constants/formNames';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useQuery } from 'react-apollo-hooks';
import { COLORS } from '../../styles/theme';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffOutlined from '@material-ui/icons/HighlightOffOutlined';
import CreateOutlined from '@material-ui/icons/CreateOutlined';

const styles = require('./GroupWorkspace.module.css');

const FilteredGroupsQuery = gql`
  query FilteredGroupsQuery(
    $orderBy: [ParentProducersOrderBy!]
    $condition: ParentProducerCondition
    $after: Cursor
    $before: Cursor
    $first: Int
    $last: Int
    $offset: Int
    $filter: ParentProducerFilter
  ) {
    parentProducers: allParentProducers(
      orderBy: $orderBy
      condition: $condition
      first: $first
      last: $last
      after: $after
      before: $before
      offset: $offset
      filter: $filter
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      nodes{
        id,
        parentProducerId,
        groupName,
        childProducers: childProducersByGroupId{
          nodes{
            childProducerId
            producerByChildProducerId{
              id,
              name
            }
          }
        }
        parentProducer: producerByParentProducerId{
          id,
          name
        }
      }
    }
  }
`;

export const AllGroups = ({ change, handleDeleteGroup, handleEditGroup, reload }) => {
  const [sizePerPage, setSizePerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [orderField, setOrderField] = useState('id');
  const [orderDir, setOrderDir] = useState('desc');
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();

  const columns = [
    {
      dataField: 'id',
      text: 'Group ID',
      sort: true,
      hidden: true
    },
    {
      dataField: 'groupName',
      text: 'Group Name',
      sort: true
    },
    {
      dataField: 'parentWorkspaceName',
      text: 'Parent Workspace',
      sort: true
    },
    {
      dataField: 'childWorkspaceName',
      text: 'Child Workspaces',
      sort: true
    },
    {
      dataField: 'action',
      text: t('general.delete')
    },
    {
      dataField: 'edit',
      text: t('general.edit')
    }
  ];

  const setLoadedGroups = React.useCallback((parentProducers) => {
    return parentProducers &&
    parentProducers.parentProducers &&
    parentProducers.parentProducers.nodes &&
    parentProducers.parentProducers.nodes.map(node => ({
      id: node.id,
      groupName: node.groupName,
      parentWorkspaceName: node.parentProducer && node.parentProducer.name,
      childWorkspaceName:
        node.childProducers &&
        node.childProducers.nodes
          .map(item => item.producerByChildProducerId.name)
          .join(','),
      action: (
        <IconButton
          size="small"
          onClick={() => {
            handleDeleteGroup(
              node.id,
              node.childProducers &&
                node.childProducers.nodes
                  .map(item => item.producerByChildProducerId.id)
                  .join(','),
              node.parentProducer && node.parentProducer.id,
              refetch
            );
          }}
        >
          <HighlightOffOutlined color="primary" fontSize="small" />
        </IconButton>
      ),
      edit: (
        <IconButton
          size="small"
          onClick={() => {
            handleEditGroup(node);
          }}
        >
          <CreateOutlined color="primary" fontSize="small" />
        </IconButton>
      )
    })).sort((a, b) => b.id - a.id);
  }, [])

  const  { loading, data: parentProducers, refetch } = useQuery(
    FilteredGroupsQuery,
    {
      variables: {
        first: sizePerPage
      }, fetchPolicy: 'network-only'
      , notifyOnNetworkStatusChange: true
    }
  );

  React.useEffect(()=> {
    const [groupReload, setGroupReload] = reload;
    if(!groupReload)
    setGroupReload(() => refetch);
  }, [refetch])

  const handleTableChange = (
    type,
    { page: newPage, sizePerPage: newSize, sortField, sortOrder }
  ) => {
    let newOrderBy = 'ID_ASC';
    if (type === 'sort') {
      switch (sortField) {
        case 'groupName':
          newOrderBy = sortOrder === 'asc' ? 'NAME_ASC' : 'NAME_DESC';
          break;

        case 'parentWorkspaceName':
          newOrderBy = sortOrder === 'asc' ? 'PARENT_ASC' : 'PARENT_DESC';
          break;

        case 'childWorkspaceName':
          newOrderBy = sortOrder === 'asc' ? 'CHILD_ASC' : 'CHILD_DESC';
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
      variables.after = parentProducers.parentProducers.pageInfo.endCursor;
    } else if (newPage < page) {
      variables.after = undefined;
      variables.before = parentProducers.parentProducers.pageInfo.startCursor;
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
      change('selectedProducts', []);
    });
  };
  if (loading) {
    return <LinearProgress />;
  }


  return (
    <div>
      <ToolkitProvider keyField="id" data={parentProducers && setLoadedGroups(parentProducers)} columns={columns}>
        {props => (
          <React.Fragment>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              pagination={paginationFactory({
                totalSize: parentProducers.parentProducers.totalCount,
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
  );
};

const mapStateToProps = state => ({
  values: getFormValues(GROUP_PRODUCER_FORM)(state)
});

const mapDispatchToProps = dispatch => ({
  handleDeleteGroup: (groupId, childProducerId, parentProducerId, reloadFunction) =>
    dispatch({
      type: 'DELETE_GROUP',
      payload: [groupId, childProducerId, parentProducerId, reloadFunction]
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllGroups);
