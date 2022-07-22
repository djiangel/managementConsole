import { all, spawn, takeEvery } from 'redux-saga/effects';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { EDIT_PRODUCT_FORM } from '../constants/formNames';
import authenticationFormSubmit from './authenticationFormSubmit';
import batchInitializationFormSubmit from './batchInitializationFormSubmit';
import clearSessionIfJWTExpired from './clearSessionIfJWTExpired';
import error from './error';
import graphqlClientStoreReset from './graphqlClientStoreReset';
import log from './log';
import panelFormSubmit from './panelFormSubmit';
import productFormSubmit from './productFormSubmit';
import segmentActionTrack from './segmentActionTrack';
import segmentUserIdentify from './segmentUserIdentify';
import sessionClear from './sessionClear';
import createProducerUser from './createProducerUser';
import updatePanelSettings from './updatePanelSettings';
import editProductFormSubmit from './editProductFormSubmit';
import deleteProduct from './deleteProduct';
import deleteGroup from './deleteGroup';
import deviceFormSubmit from './deviceFormSubmit';
import deleteCorporateDevice from './deleteCorporateDevice';
import updateNotification from './updateNotification';
import moveItem from './moveItem';
import inviteUserFormSubmit from './inviteUserFormSubmit';
import defaultProductClass from './defaultProductClass';
import deleteUser from './deleteUser';
import createUser from './createUser';
import changePassword from './changePassword';
import mergeAccount from './mergeAccount';
import createWorkspace from './createWorkspace';
import editProductReview from './editProductReview';
import requestReportFormSubmit from './requestReportFormSubmit';
import createReportQa from './createReportQa';
import createReportRevision from './createReportRevision';
import {
  productFilterFormSubmitSaga,
  productTagFeatureSaga
} from './productFilterFormSubmit';
import createDemographicTargetFormSubmit from './createDemographicTargetFormSubmit';
import editDemographicTargetFormSubmit from './editDemographicTargetFormSubmit';
import deleteDemographicTarget from './deleteDemographicTarget';
import googleAnalyticsSetSessionSaga from './googleAnalyticsSetSession';
import { groupWorkspaceFormSubmit } from './groupWorkspaceFormSubmit';
import tagHeavyUserFormSubmit from './tagHeavyUser';
import heavyUserInfoFormSubmit from './heavyUserInfo';

const allSagas = [
  authenticationFormSubmit,
  batchInitializationFormSubmit,
  clearSessionIfJWTExpired,
  defaultProductClass,
  error,
  graphqlClientStoreReset,
  inviteUserFormSubmit,
  log,
  panelFormSubmit,
  productFormSubmit,
  segmentActionTrack,
  segmentUserIdentify,
  sessionClear,
  createProducerUser,
  deviceFormSubmit,
  createUser,
  changePassword,
  mergeAccount,
  createWorkspace,
  editProductReview,
  requestReportFormSubmit,
  createReportQa,
  createReportRevision,
  productFilterFormSubmitSaga,
  productTagFeatureSaga,
  groupWorkspaceFormSubmit,
  createDemographicTargetFormSubmit,
  editDemographicTargetFormSubmit,
  deleteDemographicTarget,
  googleAnalyticsSetSessionSaga,
  tagHeavyUserFormSubmit,
  heavyUserInfoFormSubmit,
  ...moveItem
];

export default function* rootSaga() {
  yield all(allSagas.map(saga => spawn(saga)));

  yield all([
    takeEvery(FORM_SUBMIT, updatePanelSettings),
    takeEvery(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === EDIT_PRODUCT_FORM,
      editProductFormSubmit
    ),
    takeEvery('DELETE_GROUP', deleteGroup),
    takeEvery('DELETE_PRODUCT', deleteProduct),
    takeEvery('DELETE_USER', deleteUser),
    takeEvery('DELETE_DEVICE', deleteCorporateDevice),
    takeEvery('UPDATE_NOTIFICATION', updateNotification)
  ]);
}
