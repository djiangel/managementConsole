/* eslint-disable no-constant-condition */
import { all, put, select, take, call } from 'redux-saga/effects';
import {
  getFormValues,
  startSubmit,
  stopSubmit,
  destroy,
  reset,
  change
} from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import {
  GROUP_PRODUCER_FORM,
  REQUEST_REPORT_FORM
} from '../constants/formNames';
import { push as pushRoute } from 'react-router-redux';
import graphqlClient from '../consumers/graphqlClient';
import UpdateProducerByIdMutation from '../graphql/mutations/UpdateProducer';
import CreateParentProducerMutation from '../graphql/mutations/CreateParentProducer';
import CreateChildProducerMutation from '../graphql/mutations/CreateChildProducer';
import AllParentProducersQuery from '../graphql/queries/AllParentProducersQuery';
import confirmationSaga from './confirmationSaga';
import deleteParentProducerSaga from './deleteGroup';
import appToastAdd from '../actions/appToastAdd';
import { GROUP_WORKSPACES } from '../constants/routePaths';
import formatPath from '../utils/formatPath';
import gql from 'graphql-tag';

const GroupsQuery = gql`
  query GroupsQuery($parentProducerId: [Int!], $groupName: String!) {
    allParentProducers(
      filter: { parentProducerId: { in: $parentProducerId } }
      condition: { groupName: $groupName }
    ) {
      nodes {
        id
      }
    }
  }
`;

const ParentProducerByIdQuery = gql`
  query parentProducerById($id: Int!) {
    parentProducer: parentProducerById(id: $id) {
      id
      parentProducerId
      groupName
      childProducers: childProducersByGroupId {
        nodes {
          childProducerId
          producerByChildProducerId {
            id
            name
          }
        }
      }
      parentProducer: producerByParentProducerId {
        id
        name
      }
    }
  }
`;

const UpdateParentProducerById = gql`
  mutation UpdateParentProducerMutation(
    $id: Int!
    $patch: ParentProducerPatch!
  ) {
    updateParentProducerById(input: { parentProducerPatch: $patch, id: $id }) {
      parentProducer {
        id
      }
    }
  }
`;

const DeleteChildProducerById = gql`
  mutation DeleteChildProducerById($groupId: Int!, $childProducerId: Int!) {
    deleteChildProducerByGroupIdAndChildProducerId(
      input: { groupId: $groupId, childProducerId: $childProducerId }
    ) {
      deletedChildProducerId
    }
  }
`;

export function* groupWorkspaceFormSubmit() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === GROUP_PRODUCER_FORM
    );

    yield put(startSubmit(GROUP_PRODUCER_FORM));
    const values = yield select(getFormValues(GROUP_PRODUCER_FORM));
    const parentWorkspaceId =
      values.selectedParentWorkspace && values.selectedParentWorkspace.value;
    const childWorkspaceIds =
      values.selectedParentWorkspace && values.selectedChildWorkspaces;
    const groupReloadFunction = values.groupReloadFunction;

    let childIds = [];

    const grpName = values.groupName;
    try {
      // if param has oldNode value then we performing update operation
      const isEditing = values.oldNode;
      const isConfirm = yield call(confirmationSaga, {
        title: isEditing
          ? `Are you sure you want to update '${
              values.oldNode.groupName
            }' group to this new values?`
          : 'Are you sure you want to create the group?'
        //message: `Do you want to delete the group?`
      });

      if (!isConfirm) {
        return;
      }

      let grpId = 0;

      // therefore we must delete first the old entry and before creating a new one
      if (isEditing) {
        grpId = values.oldNode.id;

        // load parent
        const reloadedParentProducer = yield graphqlClient.query({
          query: ParentProducerByIdQuery,
          variables: {
            id: grpId
          },
          fetchPolicy: 'network-only'
        });

        const response = yield graphqlClient.mutate({
          mutation: UpdateParentProducerById,
          variables: {
            id: grpId,
            patch: {
              groupName: grpName
            }
          },
          refetchQueries: ['AllParentProducersQuery']
        });

        // existing children in DB ids to created a exitingKeysHash hash
        const childProducers =
          reloadedParentProducer.data &&
          reloadedParentProducer.data.parentProducer &&
          reloadedParentProducer.data.parentProducer.childProducers;
        const exitingKeysHash = childProducers.nodes.reduce((hash, item) => {
          hash[item.childProducerId] = true;
          return hash;
        }, {});

        //filter out the children already existing
        childIds =
          values.selectedChildWorkspaces &&
          values.selectedChildWorkspaces.reduce((ids, item) => {
            if (!exitingKeysHash[item.value]) ids.push(item.value);
            return ids;
          }, []);

        //selected children ids to created a selectedKeysHash hash
        const selectedKeysHash = values.selectedChildWorkspaces.reduce(
          (hash, item) => {
            hash[item.value] = true;
            return hash;
          },
          {}
        );

        //select children to be deleted
        const deletedChildIds =
          childProducers.nodes &&
          childProducers.nodes.reduce((ids, item) => {
            if (!selectedKeysHash[item.childProducerId])
              ids.push(item.childProducerId);
            return ids;
          }, []);

        //delete children deleted
        yield all(
          deletedChildIds.map(id => {
            return graphqlClient.mutate({
              mutation: DeleteChildProducerById,
              variables: {
                groupId: grpId,
                childProducerId: id
              }
            });
          })
        );
      }

      if (!isEditing) {
        yield graphqlClient.mutate({
          mutation: UpdateProducerByIdMutation,
          variables: {
            id: parentWorkspaceId,
            producerPatch: {
              isParent: true
            }
          }
        });

        const response = yield graphqlClient.mutate({
          mutation: CreateParentProducerMutation,
          variables: {
            parentProducer: {
              parentProducerId: parentWorkspaceId,
              groupName: grpName
            }
          },
          refetchQueries: { query: AllParentProducersQuery }
        });

        // get group id
        const groupId = yield graphqlClient.query({
          query: GroupsQuery,
          variables: {
            parentProducerId: parentWorkspaceId,
            groupName: grpName
          },
          fetchPolicy: 'network-only'
        });

        grpId = groupId.data.allParentProducers.nodes[0].id;

        childWorkspaceIds.forEach(item => childIds.push(item.value));
      }

      yield all(
        childIds.map(childId => {
          return graphqlClient.mutate({
            mutation: CreateChildProducerMutation,
            variables: {
              childProducer: {
                groupId: grpId,
                childProducerId: childId
              }
            },
            refetchQueries: ['AllChildProducersQuery']
          });
        })
      );

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          title: isEditing
            ? 'Group Updated Successfully'
            : 'Group Created Successfully',
          toastKey: `toast_${Date.now()}`
        })
      );

      values.resetComponentState();
      yield put(reset(GROUP_PRODUCER_FORM));

      groupReloadFunction();
    } catch (error) {
      yield put(stopSubmit(GROUP_PRODUCER_FORM, error));
      yield put(
        console.log(error.message),
        errorAction({
          error,
          title: 'Failed set isParent',
          description: error.message
        })
      );
    }
  }
}
