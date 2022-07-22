import { compose } from 'react-apollo';
import graphqlQueryEnumValues from '../../utils/graphqlQueryEnumValues';
import UserForm from './userForm';

export default compose(
  graphqlQueryEnumValues({
    typeName: 'EthnicityEnum',
    valuesPropName: 'ethnicityOptions'
  }),
  graphqlQueryEnumValues({
    typeName: 'GenderEnum',
    valuesPropName: 'genderOptions'
  }),
  graphqlQueryEnumValues({
    typeName: 'LanguageEnum',
    valuesPropName: 'languageOptions'
  }),
  graphqlQueryEnumValues({
    typeName: 'RaceEnum',
    valuesPropName: 'raceOptions'
  }),
  graphqlQueryEnumValues({
    typeName: 'SmokeEnum',
    valuesPropName: 'smokeOptions'
  })
)(UserForm);
