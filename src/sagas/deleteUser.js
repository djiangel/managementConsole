import gql from 'graphql-tag';
import graphqlClient from '../consumers/graphqlClient';
import { select, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import UserListQuery from '../graphql/queries/UserList';

const DeleteUserMutation = gql`
  mutation DeleteProducerUser($id: Int!) {
    deleteProducerUserById(input: { id: $id }) {
      producerUser {
        id
      }
    }
  }
`;

export default function* deleteUserSaga(action) {
  const workspaceProducerId = yield select(selectWorkspaceProducerId);

  try {
    yield graphqlClient.mutate({
      mutation: DeleteUserMutation,
      variables: {
        id: action.payload
      },
      refetchQueries: [
        {
          query: UserListQuery,
          variables: {
            producerId: workspaceProducerId
          }
        }
      ]
    });
    yield put(push('/users'));
  } catch (e) {
    console.log(e);
  }
}
