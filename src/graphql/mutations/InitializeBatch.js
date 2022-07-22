import gql from 'graphql-tag';

export default gql`
  mutation InitializeBatchMutation($batchState: BatchStateInput!) {
    createBatchState(input: { batchState: $batchState }) {
      batchState {
        id
      }
    }
  }
`;
