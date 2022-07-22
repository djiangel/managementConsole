import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '../../material/index';
import appWorkspaceMenuIsOpenSet from '../../actions/appWorkspaceMenuIsOpenSet';
import workspaceProducerIdSet from '../../actions/workspaceProducerIdSet';
import productFolderIdSet from '../../actions/productFolderIdSet';
import addDefaultProductClass from '../../actions/addDefaultProductClass';
import SelectWorkspaceContainer from './SelectWorkspaceContainer';
import LoadingWrapper from '../../components/LoadingWrapper';
import selectAppWorkspaceMenuIsOpen from '../../selectors/appWorkspaceMenuIsOpen';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import ViewerQuery from '../../graphql/queries/ViewerQuery';
import { Swap } from '@ant-design/icons';
import { COLORS } from '../../styles/theme';
import { PRODUCTS } from '../../constants/routePaths';
import { Link } from 'react-router-dom';

const mapStateToProps = state => ({
  menuIsOpen: selectAppWorkspaceMenuIsOpen(state),
  selectedWorkspaceKey: selectWorkspaceProducerId(state)
});

const actionCreators = {
  onClickCloseMenu: () => appWorkspaceMenuIsOpenSet(false),
  onClickOpenMenu: () => appWorkspaceMenuIsOpenSet(true),
  onChangeSelectedWorkspaceId: workspaceProducerIdSet,
  setProductFolderId: productFolderIdSet,
};

export default compose(
  connect(
    mapStateToProps,
    actionCreators
  ),
  graphql<any, any, any, any>(ViewerQuery, {
    props: ({
      data: { loading, viewer },
      ownProps: {
        onChangeSelectedWorkspaceId,
        setProductFolderId
      }
    }) => {
      const workspaceProducers = viewer && viewer.workspaceProducers;
      const workspaceProducerNodes =
        workspaceProducers && workspaceProducers.nodes;
      const workspaceKeys =
        workspaceProducerNodes &&
        workspaceProducerNodes
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(({ id }) => id);
      const workspaceProducerNamesByWorkspaceKey =
        workspaceProducerNodes &&
        workspaceProducerNodes.reduce(
          (aggregateValue, { id, name }) => ({
            ...aggregateValue,
            [id]: name
          }),
          {}
        );

      return {
        loading,
        workspaceKeys,
        workspaceProducerNamesByWorkspaceKey,
        renderWorkspaceLink: ({ children, workspaceKey }) => (
          <Link to={PRODUCTS}>
            <a
              key={workspaceKey}
              onClick={() => {
                setProductFolderId(0);
                return onChangeSelectedWorkspaceId({
                  key: workspaceKey,
                  name: workspaceProducerNamesByWorkspaceKey[workspaceKey]
                });
              }}
              tabIndex={-1}
            >
              {children}
            </a>
          </Link>
        ),
        renderWorkspaceOption: ({ workspaceKey, classes}) => {
          const workspaceProducerName =
            workspaceProducerNamesByWorkspaceKey[workspaceKey];

          return (
            <ListItem classes={{root: classes.root }} button>
              <ListItemAvatar>
                <Avatar classes={{ root: classes.avatar }}>{workspaceProducerName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.primary }}
                primary={workspaceProducerName}
              />
            </ListItem>
          );
        }
      };
    }
  })
)(props => <LoadingWrapper {...props} Component={SelectWorkspaceContainer} />);
