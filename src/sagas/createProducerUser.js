import { put, select, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { ADD_USER_PRODUCER_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import CreateProducerUserMutation from '../graphql/mutations/CreateProducerUser';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import UserByEmailQuery from '../graphql/queries/UserByEmail.js';
import ProducerByIdQuery from '../graphql/queries/ProducerByIdQuery.js';
import gql from 'graphql-tag';
import appToastAdd from '../actions/appToastAdd';
import ERROR_CODE from '../constants/errorCode';

const allUsers = gql`
  query AllProducerUsersQuery($last: Int!) {
    producerUsers: allProducerUsers(last: $last) {
      nodes {
        id
      }
    }
  }
`;

export default function* createProducerUserSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === ADD_USER_PRODUCER_FORM
    );

    yield put(startSubmit(ADD_USER_PRODUCER_FORM));

    const formValues = yield select(getFormValues(ADD_USER_PRODUCER_FORM));
    const workspaceProducerId = yield select(selectWorkspaceProducerId);

    const producerUser = {
      producerId: formValues.producerId
        ? formValues.producerId.value
        : workspaceProducerId,
      email: formValues.email
    };

    try {
      // Get user ID
      const userQueryResult = yield graphqlClient.query({
        query: UserByEmailQuery,
        variables: {
          email: producerUser.email.toLowerCase()
        }
      });

      if (!userQueryResult.data.user) {
        throw new Error('User does not exist');
      }

      // Check Producer ID
      if (formValues.producerId && formValues.producerId.value !== undefined) {
        const producerQueryResult = yield graphqlClient.query({
          query: ProducerByIdQuery,
          variables: {
            id: formValues.producerId.value
          }
        });

        if (!producerQueryResult.data.producer) {
          throw new Error('Workspace does not exist');
        }
      }

      const userId = userQueryResult.data.user.id;

      // Try and add the user
      const response = yield graphqlClient.mutate({
        mutation: CreateProducerUserMutation,
        variables: {
          producerUser: {
            userId,
            producerId: producerUser.producerId
          }
        },
        refetchQueries: ['UserListQuery']
      });

      if (!response.data.createProducerUser.producerUser) {
        throw new Error('User already in the workspace');
      }

      yield put(stopSubmit(ADD_USER_PRODUCER_FORM));

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `User ${userId} added to workspace ${
            producerUser.producerId
          }`,
          title: 'User Added to Workspace',
          toastKey: `toast_${Date.now()}`
        })
      );

      yield put(destroy(ADD_USER_PRODUCER_FORM));
    } catch (error) {
      console.log(error.message);

      if (error.message === 'User does not exist') {
        yield put(
          stopSubmit(ADD_USER_PRODUCER_FORM, {
            email: 'User does not exist. ',
            _error: {
              code: ERROR_CODE.newUser,
              email: formValues.email
            }
          })
        );
      }

      if (error.message === 'User already in the workspace') {
        yield put(
          stopSubmit(ADD_USER_PRODUCER_FORM, {
            email: 'User already in the workspace. ',
            _error: {
              code: ERROR_CODE.existingUser,
              email: formValues.email
            }
          })
        );
      }

      if (formValues.producerId !== undefined) {
        yield put(
          errorAction({
            error,
            title: 'Failed to Add User to Workspace',
            description: error.message
          })
        );
      }
    }
  }
}
