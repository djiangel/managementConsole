import gql from 'graphql-tag';

export default gql`
  mutation CreateTagMutation($tag: TagInput!) {
    createTag(input: { tag: $tag }) {
      tag {
        id
      }
    }
  }
`;
