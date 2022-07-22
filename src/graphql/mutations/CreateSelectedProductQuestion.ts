import gql from 'graphql-tag';

export default gql`
mutation CreateSelectedProductQuestion($selectedProductQuestion: SelectedProductQuestionInput!){
  createSelectedProductQuestion(
    input: {
      selectedProductQuestion: $selectedProductQuestion
    }
  ) {
    selectedProductQuestion {
      id
    }
  }
}
`;