import gql from 'graphql-tag';

export default gql`
  query AllPanelTagsQuery(
    $orderBy: [PanelTagsOrderBy!]
    $condition: PanelTagCondition!
  ) {
    panelTags: allPanelTags(orderBy: $orderBy, condition: $condition) {
      nodes {
        id
        tagId

        tag: tagByTagId {
          tag
        }
      }
    }
  }
`;
