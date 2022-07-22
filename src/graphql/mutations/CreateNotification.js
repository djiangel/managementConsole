import gql from 'graphql-tag';

export default gql`
  mutation CreateNotificationMutation($notification: NotificationInput!) {
    createNotification(input: { notification: $notification }) {
      notification {
        id
      }
    }
  }
`;
