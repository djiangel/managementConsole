import { select } from 'redux-saga/effects';
import graphqlClient from '../consumers/graphqlClient';
import UserNotificationsQuery from '../graphql/queries/UserNotificationsQuery';
import UpdateNotificationMutation from '../graphql/mutations/UpdateNotification';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import * as moment from 'moment';

export default function* updateNotificationMutation(action) {
  const workspaceProducerId = yield select(selectWorkspaceProducerId);

  try {
    yield graphqlClient.mutate({
      mutation: UpdateNotificationMutation,
      variables: {
        id: action.payload,
        patch: {
          active: false,
          readOn: moment()
        }
      },
      refetchQueries: [
        {
          query: UserNotificationsQuery,
          variables: {
            producerId: workspaceProducerId,
            active: true
          }
        }
      ]
    });
  } catch (e) {
    console.log(e);
  }
}
