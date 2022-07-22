import gql from 'graphql-tag';

export default gql`
  mutation CreateCorporateDeviceMutation(
    $corporateDevice: CorporateDeviceInput!
  ) {
    createCorporateDevice(input: { corporateDevice: $corporateDevice }) {
      corporateDevice {
        id
      }
    }
  }
`;
