import gql from 'graphql-tag';
import graphqlClient from '../consumers/graphqlClient';
import { put, all, call } from 'redux-saga/effects';
import UpdateProducerByIdMutation from '../graphql/mutations/UpdateProducer';
import confirmationSaga from './confirmationSaga';
import appToastAdd from '../actions/appToastAdd';
import { GROUP_WORKSPACES } from '../constants/routePaths';

const DeleteParentProducerMutation = gql`
  mutation DeleteParentProducerById($id: Int!) {
    deleteParentProducerById(input: { id: $id }) {
      parentProducer {
        id
      }
    }
  }
`;
const DeleteChildProducerMutation = gql`
  mutation DeleteChildProducerById($groupId: Int!, $childProducerId: Int!) {
    deleteChildProducerByGroupIdAndChildProducerId(
      input: { groupId: $groupId, childProducerId: $childProducerId }
    ) {
      deletedChildProducerId
    }
  }
`;

const GroupsQuery = gql`
  query GroupsQuery($parentProducerId: [Int!]) {
    allParentProducers(
      filter: { parentProducerId: { in: $parentProducerId } }
    ) {
      totalCount
    }
  }
`;

export default function* deleteParentProducerSaga(action) {
  try {
    const isConfirm = yield call(confirmationSaga, {
      title: 'Are you sure you want to delete the group?'
      //message: `Do you want to delete the group?`
    });

    if (!isConfirm) {
      return;
    }

    const childProducerIds = action.payload[1].length
      ? action.payload[1].split(',').map(item => Number(item))
      : [];
    const grpId = action.payload[0];
    const parentWorkspaceId = action.payload[2];
    const reloadFunction = action.payload[3];

    if (childProducerIds.length) {
      yield all(
        childProducerIds.map(childProducerId => {
          return graphqlClient.mutate({
            mutation: DeleteChildProducerMutation,
            variables: {
              groupId: grpId,
              childProducerId: childProducerId
            }
          });
        })
      );
    }

    yield graphqlClient.mutate({
      mutation: DeleteParentProducerMutation,
      variables: {
        id: grpId
      }
      //refetchQueries: { query: AllParentProducersQuery }
    });

    const count = yield graphqlClient.query({
      query: GroupsQuery,
      variables: {
        parentProducerId: parentWorkspaceId
      },
      fetchPolicy: 'network-only'
    });

    const totalCount = count.data.allParentProducers.totalCount;

    if (totalCount === 0) {
      yield graphqlClient.mutate({
        mutation: UpdateProducerByIdMutation,
        variables: {
          id: parentWorkspaceId,
          producerPatch: {
            isParent: false
          }
        }
      });
    }

    yield put(
      appToastAdd({
        durationMilliseconds: 4000,
        title: 'Group Deleted Successfully',
        toastKey: `toast_${Date.now()}`
      })
    );

    reloadFunction();
  } catch (e) {
    console.log(e);
  }
}
