import { put, take, select } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import { push } from 'react-router-redux';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { ADD_DEVICE_FORM } from '../constants/formNames';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import graphqlClient from '../consumers/graphqlClient';
import CreateCorporateDevice from '../graphql/mutations/CreateCorporateDevice';
import AllDevicesQuery from '../graphql/queries/AllDevicesQuery';
import { MANAGE_DEVICES } from '../constants/routePaths';
import errorAction from '../actions/error';

export default function* deviceFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) => type === FORM_SUBMIT && payload === ADD_DEVICE_FORM
    );

    yield put(startSubmit(ADD_DEVICE_FORM));

    const addDeviceFormValues = yield select(getFormValues(ADD_DEVICE_FORM));
    const producerId = yield select(selectWorkspaceProducerId);

    const corporateDevice = {
      producerId: producerId,
      deviceName: addDeviceFormValues.deviceName,
      deviceUid: addDeviceFormValues.deviceUid
    };

    try {
      yield graphqlClient.mutate({
        mutation: CreateCorporateDevice,
        variables: {
          corporateDevice
        },
        refetchQueries: [
          {
            query: AllDevicesQuery,
            variables: {
              condition: {
                producerId
              }
            }
          }
        ]
      });

      yield put(stopSubmit(ADD_DEVICE_FORM));
      yield put(destroy(ADD_DEVICE_FORM));
      yield put(push(MANAGE_DEVICES));
    } catch (e) {
      yield put(stopSubmit(ADD_DEVICE_FORM, e));

      yield put(
        errorAction({
          e,
          title: 'Failed to add corporate device',
          description: e.message
        })
      );
    }
  }
}
