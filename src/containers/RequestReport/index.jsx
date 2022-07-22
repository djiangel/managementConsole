import React from 'react';
import { reduxForm } from 'redux-form';
import formSubmit from '../../actions/formSubmit';
import { REQUEST_REPORT_FORM } from '../../constants/formNames';
import RequestReport from './RequestReport';

const validation = val => !val || (typeof val === 'object' && val.length === 0);
const validateBool = val => !(val === true || val === false);

export default reduxForm({
  form: REQUEST_REPORT_FORM,
  onSubmit: (values, dispatch) => {
    dispatch(formSubmit(REQUEST_REPORT_FORM));
  },
  validate: values => {
    const validated = {
      type: validation(values.type),
      projectName: validation(values.projectName),
      demographic: validation(values.demographic),
      client: validation(values.client),
      countries: validation(values.countries),
      // raceEthnicity: validation(values.raceEthnicity), // For Single country
      ages: validation(values.ages),
      gender: validation(values.gender),
      // smokingHabits: validation(values.smokingHabits),
      // socioEcon: validation(values.socioEcon),
      // regionTarget: validation(values.regionTarget),
      // gravityConstraint: validation(values.gravityConstraint),
      constraintLevel: validation(values.constraintLevel)
    };

    // TODO
    // For Multi Countries
    // values.countries && values.countries.map(country => {
    //   if (!values[`raceEthnicity_${country.value}`] || values[`raceEthnicity_${country.value}`].length === 0)
    //     validated[`raceEthnicity_${country.value}`] = true;
    // });

    return validated;
  },
  destroyOnUnmount: false,
  initialValues: {
    products: [],
    folders: [],
    type: '',
    newReferenceFlavors: true,
    folderProducts: {},
    ages: [[20, 50]],
    experienceLevel: [[1, 3]]
  }
})(RequestReport);
