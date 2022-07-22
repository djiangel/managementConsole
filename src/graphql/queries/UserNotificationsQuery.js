import gql from 'graphql-tag';

export default gql`
  query UserNotificationsQuery($producerId: Int!, $active: Boolean) {
    notifications: allNotifications(
      condition: { producerId: $producerId, active: $active }
    ) {
      nodes {
        id
        active
        readOn
        notificationTypeId
        userId
        producerId
        user: userByUserId {
          id
          name
        }
        notificationType: notificationTypeByNotificationTypeId {
          id
          notificationType
          productId
          product: productByProductId {
            id
            name
            createdAt
            updatedAt
          }
          panelId
          panel: panelByPanelId {
            id
            pin
          }
          marketSurveyReportId
          marketSurveyReport: marketSurveyReportByMarketSurveyReportId {
            id
            projectName
            demographic
          }
          optimizationReportId
          optimizationReport: optimizationReportByOptimizationReportId {
            id
            projectName
            demographic
          }
          role
          sentOn
        }
      }
    }
  }
`;
