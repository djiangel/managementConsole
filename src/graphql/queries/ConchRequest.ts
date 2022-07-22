import gql from 'graphql-tag';

export default gql`
  query ConchRequest($input: ConchRequestInput!) {
    conchRequest(input: $input)
  }
`;
