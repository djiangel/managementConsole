import gql from 'graphql-tag';

export default gql`
  mutation NotifyRequestReport($input: NotifyRequestReportInput!) {
    notifyRequestReport(input: $input)
  }
`;
