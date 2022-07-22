import gql from 'graphql-tag';

export default gql`
  mutation CreateNotificationTypeMutation(
    $notificationType: NotificationTypeInput!
  ) {
    createNotificationType(input: { notificationType: $notificationType }) {
      notificationType {
        id
      }
    }
  }
`;
