import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { EDIT_DEMOGRAPHIC_TARGET_FORM } from '../../../constants/formNames';
import formSubmit from '../../../actions/formSubmit';
import AgeSlider from '../../RequestReport/Demographics/AgeSlider';
import { useTranslation } from 'react-i18next';
import MaterialButton from '../../../components/MaterialButton';
import { COUNTRIES } from '../../../constants/report';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { concat } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputSelect from '../../../components/FormInputSelect';
import FormInputRadio from '../../../components/FormInputRadio';
import LoadingScreen from 'components/LoadingScreen';
import FieldTextInput from 'components/FieldTextInput';
import i18n from '../../../i18n';

const styles = require('../DemographicTarget.module.css');

const countryOptions = COUNTRIES.map(country => ({
  label: `${country.emoji} ${country.name}`,
  value: country.code
}));

const genderOptions: any[] = i18n.t('gender', { returnObjects: true });

const smokingHabitOptions: any[] = i18n.t('smokingHabitsOptions', {
  returnObjects: true
});

const socioEconOptions: any[] = i18n.t('socioEcon', { returnObjects: true });

const regionTargetOptions: any[] = i18n.t('regionTarget', {
  returnObjects: true
});

const DemographicTargetEdit = ({
  pristine,
  invalid,
  submitting,
  handleSubmit,
  change,
  ages,
  ageCategory,
  countries,
  initialized,
  smokingHabits,
  handleClose,
  handleDeleteDemographicTarget,
  ...formValues
}) => {
  const { t } = useTranslation();
  const closeSlider = idx => {
    change('ages', concat(ages.slice(0, idx), ages.slice(idx + 1)));
  };

  const addSlider = () => {
    change('ages', concat(ages, [[20, 50]]));
  };

  if (!initialized) {
    return <LoadingScreen />;
  }

  const currentCountry =
    countries && COUNTRIES.find(country => country.code === countries.value);

  const ageSliders = ages.map((age, i) => (
    <div className={styles.sliderContainer}>
      <AgeSlider
        key={i}
        ageCategory={ageCategory}
        value={age}
        onChange={newValue =>
          change(
            'ages',
            ages.map((age, index) => (index === i ? newValue : age))
          )
        }
      />
      {ages.length > 1 && (
        <IconButton onClick={() => closeSlider(i)}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  ));

  return (
    <Paper className={styles.container}>
      <h5 className={styles.pageHeader}>
        {t('navigation.demographicTargets')}
      </h5>
      <h3 className={styles.pageTitle}>{t('demographicTarget.edit')}</h3>

      <div className={styles.competitiveSetTable}>
        <table>
          <tbody>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('demographicTarget.name')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="name"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('demographicTarget.namePlaceholder')}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.countries')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="countries"
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  key="countries"
                  options={countryOptions}
                  isSearchable
                  isClearable
                  placeholder={t('reports.countryPlaceholder')}
                  onChange={(event, newValue, previousValue) =>
                    newValue !== previousValue && change('ethnicities', [])
                  }
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>{t('reports.ages')}</span>
              </td>
              <td className={styles.valueColumn}>
                <React.Fragment>
                  {ageSliders}
                  <MaterialButton size="small" onClick={addSlider}>
                    <AddIcon />
                    {t('reports.addAgeRange')}
                  </MaterialButton>
                </React.Fragment>
              </td>
            </tr>

            {currentCountry && (
              <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.raceEthnicity')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {currentCountry ? (
                    <Field
                      name="ethnicities"
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      key={`ethnicities_${currentCountry.code}`}
                      options={
                        currentCountry.raceAndEthnicity
                          ? currentCountry.raceAndEthnicity.map(race => ({
                              value: race,
                              label: race
                            }))
                          : [
                              {
                                value: `General ${currentCountry.name}`,
                                label: `General ${currentCountry.name}`
                              }
                            ]
                      }
                      isSearchable
                      isClearable
                      placeholder={t('reports.racePlaceholder')}
                      checkbox
                      isMulti
                    />
                  ) : (
                    <span>{t('reports.raceEthnicitySelectCountry')}</span>
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.gender')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="gender"
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  key="gender"
                  options={genderOptions}
                  isSearchable
                  isClearable
                  placeholder={t('reports.genderPlaceholder')}
                  checkbox
                  isMulti
                  onChange={(event, newValue) => {
                    newValue.find(v => v.value === 'Census-Adjusted') &&
                    newValue.find(v => v.value !== 'Census-Adjusted')
                      ? event.preventDefault()
                      : change('gender', newValue);
                  }}
                />
              </td>
            </tr>
            {/* Smoking Habits removed for now */}
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.smokingHabits')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="smokingHabits"
                  component={FormInputRadio}
                  key="smokingHabits"
                  required
                  options={smokingHabitOptions}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.socioEconReportTitle')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="socioEcon"
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  key="socioEcon"
                  options={socioEconOptions}
                  isSearchable
                  isClearable
                  placeholder={t('reports.socioEconPlaceholder')}
                  checkbox
                  isMulti
                  onChange={(event, newValue) => {
                    newValue.find(v => v.value === 'Census-Adjusted') &&
                    newValue.find(v => v.value !== 'Census-Adjusted')
                      ? event.preventDefault()
                      : change('socioEcon', newValue);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.regionTarget')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <Field
                  name="regionTarget"
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  key="regionTarget"
                  options={regionTargetOptions}
                  isSearchable
                  isClearable
                  placeholder={t('reports.regionTargetPlaceholder')}
                  checkbox
                  isMulti
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.buttonContainer}>
        <MaterialButton
          color="secondary"
          variant="outlined"
          onClick={handleDeleteDemographicTarget}
          soft
        >
          {t('demographicTarget.delete')}
        </MaterialButton>
        <MaterialButton
          variant="outlined"
          disabled={pristine || invalid || submitting}
          onClick={() => {
            handleSubmit();
            handleClose();
          }}
          soft
          teal
        >
          {t('general.confirm')}
        </MaterialButton>
        <MaterialButton variant="outlined" onClick={handleClose} soft>
          Discard Changes
        </MaterialButton>
      </div>
    </Paper>
  );
};

const getEthnicities = (countries, ethnicities) => {
  if (!countries || !ethnicities) {
    return [];
  }

  const currentCountry =
    countries && COUNTRIES.find(country => countries == country.code);

  const ethnicityOptions = currentCountry.raceAndEthnicity
    ? currentCountry.raceAndEthnicity.map(race => ({
        value: race,
        label: race
      }))
    : [
        {
          value: `General ${currentCountry.name}`,
          label: `General ${currentCountry.name}`
        }
      ];

  return ethnicityOptions.filter(ethnicity =>
    ethnicities.find(e => e.toLowerCase() === ethnicity.value.toLowerCase())
  );
};

const mapStateToProps = (state, props) => {
  const formValues = getFormValues(EDIT_DEMOGRAPHIC_TARGET_FORM)(state);
  return {
    ...formValues,
    initialValues: {
      id: props.id,
      name: props.name,
      countries: props.countries
        ? countryOptions.find(country => props.countries == country.value)
        : undefined,
      oldCountries: props.countries
        ? countryOptions.find(country => props.countries == country.value)
        : undefined,
      ethnicities: getEthnicities(props.countries, props.ethnicities),
      oldEthnicities: getEthnicities(props.countries, props.ethnicities),
      ages: props.ages && props.ages.map(age => age.split('-')),
      oldAges: props.ages && props.ages.map(age => age.split('-')),
      gender:
        props.genders &&
        genderOptions.filter(gender =>
          props.genders.find(
            g => g.toLowerCase() === gender.value.toLowerCase()
          )
        ),
      oldGender:
        props.genders &&
        genderOptions.filter(gender =>
          props.genders.find(
            g => g.toLowerCase() === gender.value.toLowerCase()
          )
        ),
      smokingHabits: props.smokingHabits,
      oldSmokingHabits: props.smokingHabits,
      socioEcon:
        props.socioEcon &&
        socioEconOptions.filter(opt =>
          props.socioEcon.find(
            se => se.toLowerCase() === opt.value.toLowerCase()
          )
        ),
      oldSocioEcon:
        props.socioEcon &&
        socioEconOptions.filter(opt =>
          props.socioEcon.find(
            se => se.toLowerCase() === opt.value.toLowerCase()
          )
        ),
      regionTarget:
        props.regionTarget &&
        regionTargetOptions.filter(opt =>
          props.regionTarget.find(
            rt => rt.toLowerCase() === opt.value.toLowerCase()
          )
        ),
      oldRegionTarget:
        props.regionTarget &&
        regionTargetOptions.filter(opt =>
          props.regionTarget.find(
            rt => rt.toLowerCase() === opt.value.toLowerCase()
          )
        )
    }
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  handleDeleteDemographicTarget: () =>
    dispatch({ type: 'DELETE_DEMOGRAPHIC_TARGET', id: props.id })
});

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: EDIT_DEMOGRAPHIC_TARGET_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(EDIT_DEMOGRAPHIC_TARGET_FORM));
    },
    validate: values => {
      return {
        name: validation(values.name)
      };
    }
  })
)(DemographicTargetEdit);
