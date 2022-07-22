import gql from 'graphql-tag';

export default gql`
  query AllTagsQuery($orderBy: [TagsOrderBy!], $condition: TagCondition!) {
    tags: allTags(orderBy: $orderBy, condition: $condition) {
      nodes {
        id
        tag
      }
    }
  }
`;
