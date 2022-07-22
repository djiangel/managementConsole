import gql from 'graphql-tag';

export default gql`
  query EnumValuesQuery($typeName: String!) {
    enum: __type(name: $typeName) {
      values: enumValues {
        name
        description
      }
    }
  }
`;
