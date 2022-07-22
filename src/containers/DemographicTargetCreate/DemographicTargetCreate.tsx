import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { ADD_DEMOGRAPHIC_TARGET_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import AgeSlider from '../RequestReport/Demographics/AgeSlider';
import { useTranslation } from 'react-i18next';
import MaterialButton from '../../components/MaterialButton';
import { COUNTRIES } from '../../constants/report';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { concat } from 'lodash';
import FormInput from '../../components/FormInput';
import FormInputSelect from '../../components/FormInputSelect';
import FormInputRadio from '../../components/FormInputRadio';
import LoadingScreen from 'components/LoadingScreen';
import FieldTextInput from 'components/FieldTextInput';

const styles = require('./DemographicTargetCreate.module.css');

const DemographicTarget = ({
  pristine,
  invalid,
  submitting,
  handleSubmit,
  change,
  ages,
  ageCategory,
  countries,
  initialized,
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
      <h3 className={styles.pageTitle}>
        {t('demographicTarget.createDemographicTarget')}
      </h3>

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
                  options={COUNTRIES.map(country => ({
                    label: `${country.emoji} ${country.name}`,
                    value: country.code
                  }))}
                  isSearchable
                  isClearable
                  placeholder={t('reports.countryPlaceholder')}
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
                {/* )} */}
              </td>
            </tr>

            {/* <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.experienceLevel')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  <React.Fragment>{experienceLevelSliders}</React.Fragment>
                </td>
              </tr> */}

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
                      name="raceEthnicity"
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      key={`raceEthnicity_${currentCountry.code}`}
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
                  options={t('gender', { returnObjects: true })}
                  isSearchable
                  isClearable
                  placeholder={t('reports.genderPlaceholder')}
                  checkbox
                  // isMulti
                  // onChange={(event, newValue) => {
                  //   newValue.find(v => v.value === 'Census-Adjusted') &&
                  //   newValue.find(v => v.value !== 'Census-Adjusted')
                  //     ? event.preventDefault()
                  //     : change('gender', newValue);
                  // }}
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
                  options={t('smokingHabitsOptions', {
                    returnObjects: true
                  })}
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
                  options={t('socioEcon', { returnObjects: true })}
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
                  options={t('regionTarget', { returnObjects: true })}
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
          variant="outlined"
          disabled={pristine || invalid || submitting}
          onClick={handleSubmit}
          soft
          teal
        >
          {t('general.confirm')}
        </MaterialButton>
      </div>
    </Paper>
  );
};

const mapStateToProps = state => {
  const formValues = getFormValues(ADD_DEMOGRAPHIC_TARGET_FORM)(state);
  return {
    ...formValues
  };
};

const mapDispatchToProps = {};

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: ADD_DEMOGRAPHIC_TARGET_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(ADD_DEMOGRAPHIC_TARGET_FORM));
    },
    initialValues: {
      ages: [],
      experienceLevel: [[1, 3]]
    },
    validate: values => {
      return {
        name: validation(values.name),
      };
    },
  })
)(DemographicTarget);
