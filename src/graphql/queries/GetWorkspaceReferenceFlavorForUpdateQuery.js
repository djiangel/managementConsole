import gql from 'graphql-tag';

export default gql`
  query GetWorkspaceReferenceFlavorForUpdateQuery($workspaceId: Int!) {
    workspaceReferenceFlavorForUpdate: getWorkspaceReferenceFlavorForUpdate(
      workspaceId: $workspaceId
    ) {
      nodes {
        id
        flavorAttribute
        value
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
        base
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
        isDeleted
      }
    }
  }
`;
