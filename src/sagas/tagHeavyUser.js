import { put, select, take } from 'redux-saga/effects';
import {
  getFormValues,
  startSubmit,
  stopSubmit,
  change,
  reset
} from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { TAG_HEAVY_USER_FORM } from '../constants/formNames';
import appToastAdd from '../actions/appToastAdd';
import graphqlClient from '../consumers/graphqlClient';
import gql from 'graphql-tag';
import { labelObjectsToValue } from '../utils/sagaHelper';

const BatchTagHeavyUserQuery = gql`
  mutation BatchTagHeavyUserQuery($input: BatchTagHeavyUserInput!) {
    batchTagHeavyUser(input: $input)
  }
`;

export default function* tagHeavyUserFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === TAG_HEAVY_USER_FORM
    );

    yield put(startSubmit(TAG_HEAVY_USER_FORM));

    const tagHeavyUserFormValues = yield select(
      getFormValues(TAG_HEAVY_USER_FORM)
    );

    const {
      usersFromCsv,
      categories,
      features,
      componentBases,
      componentOthers,
      tag
    } = tagHeavyUserFormValues;

    try {
      // With CSV
      const batchTagHeavyUser = yield graphqlClient.mutate({
        mutation: BatchTagHeavyUserQuery,
        variables: {
          input: {
            usernameOrEmails: usersFromCsv.map(row => row.user),
            tag: tag,
            categoryIds:
              categories &&
              categories.length &&
              labelObjectsToValue(categories),
            featureIds:
              features && features.length && labelObjectsToValue(features),
            componentBaseIds:
              componentBases &&
              componentBases.length &&
              labelObjectsToValue(componentBases),
            componentOtherIds:
              componentOthers &&
              componentOthers.length &&
              labelObjectsToValue(componentOthers)
          }
        }
      });

      if (batchTagHeavyUser.data.batchTagHeavyUser.error) {
        throw new Error('Tagging Failed');
      }

      yield put(reset(TAG_HEAVY_USER_FORM));

      yield put(
        change(
          TAG_HEAVY_USER_FORM,
          'notFoundUsers',
          batchTagHeavyUser.data.batchTagHeavyUser.notAvailableUsers
        )
      );

      yield put(stopSubmit(TAG_HEAVY_USER_FORM));

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Users tagged as heavy users.`,
          title: 'Heavy User Tagged',
          toastKey: `toast_${Date.now()}`
        })
      );
    } catch (error) {
      yield put(stopSubmit(TAG_HEAVY_USER_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Tag Heavy Users',
          description: error.message
        })
      );
    }
  }
}
