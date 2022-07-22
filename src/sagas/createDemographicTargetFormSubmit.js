import { put, select, take } from 'redux-saga/effects';
import { destroy, getFormValues, startSubmit, stopSubmit } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { ADD_DEMOGRAPHIC_TARGET_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import CreateDemographicTargetMutation from '../graphql/mutations/CreateDemographicTarget';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import selectViewerUserId from '../selectors/viewerUserId';
import { labelObjectsToCsv, labelObjectsToValue } from '../utils/sagaHelper';
import appToastAdd from '../actions/appToastAdd';
import { push as pushRoute } from 'react-router-redux';
import { DEMOGRAPHIC_TARGETS } from '../constants/routePaths';
import AllDemographicTargetQuery from '../graphql/queries/AllDemographicTargetQuery';

export default function* createDemographicTargetFormSubmit() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === ADD_DEMOGRAPHIC_TARGET_FORM
    );

    yield put(startSubmit(ADD_DEMOGRAPHIC_TARGET_FORM));

    const formValues = yield select(getFormValues(ADD_DEMOGRAPHIC_TARGET_FORM));
    const viewerUserId = yield select(selectViewerUserId);
    const workspaceProducerId = yield select(selectWorkspaceProducerId);

    try {
      // Add request to DB
      const demographicTarget = {
        userId: viewerUserId,
        producerId: workspaceProducerId,
        name: formValues.name,
        countries:
          formValues.countries && labelObjectsToCsv(formValues.countries),
        ages: formValues.ages.map(age => `${age[0]}-${age[1]}`).join(','),
        ethnicities: formValues.countries
          ? labelObjectsToCsv(formValues.raceEthnicity)
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

      yield graphqlClient.mutate({
        mutation: CreateDemographicTargetMutation,
        variables: {
          demographicTarget
        },
        refetchQueries: [
          {
            query: AllDemographicTargetQuery,
            variables: {
              first: 25,
              condition: {
                producerId: workspaceProducerId
              },
              orderBy: 'ID_DESC'
            }
          }
        ]
      });

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Demographic "${formValues.name}" successfully created`,
          title: 'New Demographic Target',
          toastKey: `toast_${Date.now()}`
        })
      );

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(ADD_DEMOGRAPHIC_TARGET_FORM));
      yield put(destroy(ADD_DEMOGRAPHIC_TARGET_FORM));
    } catch (error) {
      yield put(stopSubmit(ADD_DEMOGRAPHIC_TARGET_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create Demographic',
          description: error.message
        })
      );
    }

    yield put(pushRoute(DEMOGRAPHIC_TARGETS));
  }
}
