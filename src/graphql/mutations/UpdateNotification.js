import gql from 'graphql-tag';

export default gql`
  mutation UpdateNotificationMutation($id: Int!, $patch: NotificationPatch!) {
    updateNotificationById(input: { notificationPatch: $patch, id: $id }) {
      notification {
        id
      }
    }
  }
`;
