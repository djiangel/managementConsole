import { put, select, take } from 'redux-saga/effects';
import { destroy, getFormValues, startSubmit, stopSubmit } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { EDIT_DEMOGRAPHIC_TARGET_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import UpdateDemographicTarget from '../graphql/mutations/UpdateDemographicTarget';
import { labelObjectsToCsv } from '../utils/sagaHelper';
import appToastAdd from '../actions/appToastAdd';

export default function* editDemographicTargetFormSubmit() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === EDIT_DEMOGRAPHIC_TARGET_FORM
    );

    yield put(startSubmit(EDIT_DEMOGRAPHIC_TARGET_FORM));

    const formValues = yield select(
      getFormValues(EDIT_DEMOGRAPHIC_TARGET_FORM)
    );

    try {
      // Add request to DB
      const patch = {
        name: formValues.name,
        countries:
          formValues.countries && labelObjectsToCsv(formValues.countries),
        ages: formValues.ages.map(age => `${age[0]}-${age[1]}`).join(','),
        ethnicities: formValues.countries
          ? labelObjectsToCsv(formValues.ethnicities)
          : undefined,
        genders: formValues.gender && labelObjectsToCsv(formValues.gender),
        smokingHabits: formValues.smokingHabits,
        socioEcon: formValues.socioEcon
          ? labelObjectsToCsv(formValues.socioEcon)
          : undefined,
        regionTarget: formValues.regionTarget
          ? labelObjectsToCsv(formValues.regionTarget)
          : undefined
      };

      console.log(patch);

      yield graphqlClient.mutate({
        mutation: UpdateDemographicTarget,
        variables: {
          patch,
          id: formValues.id
        },
        refetchQueries: ['DemographicTargetByIdQuery']
      });

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Demographic "${formValues.name}" successfully edited`,
          title: 'Edit Demographic Target',
          toastKey: `toast_${Date.now()}`
        })
      );

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(EDIT_DEMOGRAPHIC_TARGET_FORM));
      yield put(destroy(EDIT_DEMOGRAPHIC_TARGET_FORM));
    } catch (error) {
      yield put(stopSubmit(EDIT_DEMOGRAPHIC_TARGET_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Edit Demographic',
          description: error.message
        })
      );
    }
  }
}
