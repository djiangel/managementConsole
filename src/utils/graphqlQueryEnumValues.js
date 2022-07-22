import { lowerCase, upperFirst } from 'lodash';
import { graphql } from 'react-apollo';
import EnumValuesQuery from '../graphql/queries/EnumValues';

export default function graphqlQueryEnumValues({ typeName, valuesPropName }) {
  return graphql(EnumValuesQuery, {
    options: {
      variables: { typeName }
    },
    props: ({ data: { loading, enum: _enum } }) => ({
      [`${valuesPropName}Loading`]: loading,
      [valuesPropName]:
        _enum &&
        _enum.values &&
        _enum.values.map(({ name }) => ({
          label: upperFirst(lowerCase(name)),
          value: name
        }))
    })
  });
}
