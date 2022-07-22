import gql from 'graphql-tag';

export default gql`
  query AllDevicesQuery(
    $orderBy: [CorporateDevicesOrderBy!]
    $condition: CorporateDeviceCondition!
  ) {
    allCorporateDevices(orderBy: $orderBy, condition: $condition) {
      nodes {
        id
        deviceName
        deviceUid
      }
    }
  }
`;
