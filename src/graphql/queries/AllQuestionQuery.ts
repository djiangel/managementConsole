import gql from 'graphql-tag';

export default gql`
  query AllQuestionQuery {
    questions: allQuestions {
      nodes {
        id
        slug
        qOrder
        category
      }
    }
  }
`