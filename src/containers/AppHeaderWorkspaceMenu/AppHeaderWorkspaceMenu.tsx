/* eslint-disable react/prop-types */
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import appWorkspaceMenuIsOpenSet from '../../actions/appWorkspaceMenuIsOpenSet';
import workspaceProducerIdSet from '../../actions/workspaceProducerIdSet';
import productFolderIdSet from '../../actions/productFolderIdSet';
import changeProductTablePage from '../../actions/changeProductTablePage';
import AppWorkspaceMenu from '../../components/AppWorkspaceMenu';
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
  setProductTablePage: changeProductTablePage
  // addDefaultProductClass
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
        // addDefaultProductClass,
        setProductFolderId,
        setProductTablePage
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
        renderWorkspaceLink: ({ children, workspaceKey, clearSearch }) => (
          <Link to={PRODUCTS} key={workspaceKey}>
            <a
              key={workspaceKey}
              onClick={() => {
                // addDefaultProductClass(workspaceKey);
                clearSearch()
                setProductFolderId(0);
                setProductTablePage(1)
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
        renderCurrentWorkspace: ({
          workspaceKey,
          workspaceOptionClassName,
          workspaceCurrentTextClassName
        }) => {
          const workspaceProducerName =
            workspaceProducerNamesByWorkspaceKey[workspaceKey];
          return (
            <div className={workspaceOptionClassName} key={workspaceKey}>
              <Swap style={{ color: COLORS.AQUA_MARINE, fontSize: 18 }} />
              <div className={workspaceCurrentTextClassName}>
                {workspaceProducerName}
              </div>
            </div>
          );
        },
        renderWorkspaceOption: ({ workspaceKey, classes }) => {
          const workspaceProducerName =
            workspaceProducerNamesByWorkspaceKey[workspaceKey];

          return (
            <ListItem key={workspaceKey}>
              <ListItemAvatar>
                <Avatar>{workspaceProducerName.charAt(0)}</Avatar>
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
)(props => <LoadingWrapper {...props} Component={AppWorkspaceMenu} />);
