import gql from 'graphql-tag';

export default gql`
  query AllReferenceFlavorsQuery {
    allReferenceFlavors {
      nodes {
        id
        value
        flavorAttribute
        english
        japanese
        spanish
        spanishAr
        spanishCo
        spanishMx
        chinese
        german
        italian
        portuguese
        portugueseBr
        russian
        tagalog
        thai
        vietnamese
        version
        visible
        polish
        french
        turkish
        romania
        gujarati
        tamil
        indonesian
        arabic
        bengali
        egyptian
        kannada
        norwegian
        hindi
      }
    }
  }
`;
