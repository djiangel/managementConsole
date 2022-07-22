import gql from 'graphql-tag';

export default gql`
  mutation DeleteCorporateDevice($id: Int!) {
    deleteCorporateDeviceById(input: { id: $id }) {
      deletedCorporateDeviceId
    }
  }
`;
