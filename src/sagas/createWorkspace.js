import { call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { CREATE_WORKSPACE_FORM } from '../constants/formNames';
import appToastAdd from '../actions/appToastAdd';
import graphqlClient from '../consumers/graphqlClient';
import CreateWorkspace from '../graphql/mutations/CreateWorkspace';

export default function* createWorkspaceFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === CREATE_WORKSPACE_FORM
    );

    yield put(startSubmit(CREATE_WORKSPACE_FORM));

    const createWorkspaceFormValues = yield select(
      getFormValues(CREATE_WORKSPACE_FORM)
    );

    const workspaceToCreate = {
      name: createWorkspaceFormValues.name,
      slug: createWorkspaceFormValues.slug.toLowerCase(),
      defaultTimezone: createWorkspaceFormValues.defaultTimezone.value,
      allowBehavioralQuestions: true
    };

    try {
      // Submit createWorkspaceFormValues via createJSONWebToken...
      const createQuery = yield graphqlClient.mutate({
        mutation: CreateWorkspace,
        variables: {
          workspace: workspaceToCreate
        }
      });

      const { id, name } = createQuery.data.createProducer.producer;

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(CREATE_WORKSPACE_FORM));

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Workspace ${name} with ID ${id} Created`,
          title: 'Workspace Creation Successful',
          toastKey: `toast_${Date.now()}`
        })
      );

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(CREATE_WORKSPACE_FORM));
    } catch (error) {
      yield put(stopSubmit(CREATE_WORKSPACE_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Workspace',
          description: error.message
        })
      );
    }
  }
}
