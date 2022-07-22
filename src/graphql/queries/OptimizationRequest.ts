import gql from 'graphql-tag';

export default gql`
  query OptimizationRequest($input: OptimizationRequestInput!) {
    optimizationRequest(input: $input)
  }
`;
