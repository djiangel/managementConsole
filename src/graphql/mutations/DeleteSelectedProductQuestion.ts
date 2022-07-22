import gql from 'graphql-tag';

export default gql`
  mutation DeleteSelectedProductQuestion($selectedProductQuestionId: Int!) {
    deleteSelectedProductQuestionById(input: { id: $selectedProductQuestionId }) {
      selectedProductQuestion {
        id
        questionId
      }
    }
  }
`;
