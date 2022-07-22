import { put, take, call, select } from 'redux-saga/effects';
import { destroy } from 'redux-form';
import errorAction from '../actions/error';
import { EDIT_DEMOGRAPHIC_TARGET_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import DeleteDemographicTarget from '../graphql/mutations/DeleteDemographicTarget';
import appToastAdd from '../actions/appToastAdd';
import confirmationSaga from './confirmationSaga';
import { push } from 'react-router-redux';
import { DEMOGRAPHIC_TARGETS } from '../constants/routePaths';
import AllDemographicTargetQuery from '../graphql/queries/AllDemographicTargetQuery';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';

export default function* deleteDemographicTarget() {
  while (true) {
    const { id } = yield take(
      ({ type }) => type === 'DELETE_DEMOGRAPHIC_TARGET'
    );

    const workspaceProducerId = yield select(selectWorkspaceProducerId);

    try {
      const isConfirm = yield call(confirmationSaga, {
        title: 'Delete Product',
        message: `Are you sure you want to delete this demographic target?`
      });

      if (isConfirm) {
        yield graphqlClient.mutate({
          mutation: DeleteDemographicTarget,
          variables: {
            id
          },
          refetchQueries: [
            {
              query: AllDemographicTargetQuery,
              variables: {
                first: 25,
                condition: {
                  producerId: workspaceProducerId
                },
                orderBy: 'ID_DESC'
              }
            }
          ]
        });

        yield put(
          appToastAdd({
            durationMilliseconds: 4000,
            message: `Demographic successfully deleted`,
            title: 'Delete Demographic Target',
            toastKey: `toast_${Date.now()}`
          })
        );

        // If this point is reached, the form was submitted without error
        yield put(destroy(EDIT_DEMOGRAPHIC_TARGET_FORM));
        yield put(push(DEMOGRAPHIC_TARGETS));
      }
    } catch (error) {
      yield put(
        errorAction({
          error,
          title: 'Failed to Delete Demographic',
          description: error.message
        })
      );
    }
  }
}
