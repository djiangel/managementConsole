import { select } from 'redux-saga/effects';
import graphqlClient from '../consumers/graphqlClient';
import AllDevicesQuery from '../graphql/queries/AllDevicesQuery';
import DeleteCorporateDeviceMutation from '../graphql/mutations/DeleteCorporateDevice';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';

export default function* deleteCorporateDeviceMutation(action) {
  const producerId = yield select(selectWorkspaceProducerId);

  try {
    yield graphqlClient.mutate({
      mutation: DeleteCorporateDeviceMutation,
      variables: {
        id: action.payload
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
  } catch (e) {
    console.log(e);
  }
}
