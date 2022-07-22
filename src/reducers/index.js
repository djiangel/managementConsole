import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';
import appPersistenceHasLoaded from './appPersistenceHasLoaded';
import appToasts from './appToasts';
import appViewerMenuIsOpen from './appViewerMenuIsOpen';
import appViewerNotificationIsOpen from './appViewerNotificationIsOpen';
import appWorkspaceMenuIsOpen from './appWorkspaceMenuIsOpen';
import session from './session';
import workspaceProducerId from './workspaceProducerId';
import productFolderId from './productFolderId';
import updateBlindLabel from './updateBlindLabel';
import productTablePage from './productTablePage';
import modal from './modal';

export default combineReducers({
  appPersistenceHasLoaded,
  appToasts,
  appViewerMenuIsOpen,
  appViewerNotificationIsOpen,
  appWorkspaceMenuIsOpen,
  form,
  router,
  session,
  workspaceProducerId,
  productFolderId,
  updateBlindLabel,
  productTablePage,
  modal
});
