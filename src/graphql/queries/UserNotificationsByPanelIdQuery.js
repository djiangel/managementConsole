import gql from 'graphql-tag';

export default gql`
  query UserNotificationsByPanelIdQuery(
    $panelId: Int!
    $notificationType: NotificationTypeEnum
  ) {
    notifications: allNotificationTypes(
      condition: { panelId: $panelId, notificationType: $notificationType }
    ) {
      totalCount
      nodes {
        id
      }
    }
  }
`;
