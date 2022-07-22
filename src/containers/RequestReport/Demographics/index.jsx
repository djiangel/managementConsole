import React from 'react';
import { withTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import FormInput from '../../../components/FormInput';
import styles from '../RequestReport.module.css';
import Tag from '../../../components/FormInputTag/Tag';
import FormInputSelect from '../../../components/FormInputSelect';
import { COUNTRIES } from '../../../constants/report';
import FormInputRadio from '../../../components/FormInputRadio';
import { Grid, Input, InputAdornment, IconButton } from '@material-ui/core';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import RequestReportSearch from '../../../components/RequestReportSearch';
import DemographicTargetSearch from '../../../components/DemographicTargetSearch';
import AgeSlider from './AgeSlider';
import ExperienceLevelSlider from './ExperienceLevelSlider';
import MaterialButton from '../../../components/MaterialButton';
import { concat } from 'lodash';

class Demographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      showSearch: 'false'
    };
  }

  render() {
    const {
      displayMode,
      countries,
      ages,
      experienceLevel,
      ageCategory,
      change,
      t,
      ...formValues
    } = this.props;

    const setShowSearch = value => {
      this.setState({ showSearch: value });
    };

    const setSearchString = value => {
      this.setState({ searchString: value });
    };

    const { searchString, showSearch, sliderCount } = this.state;

    const handleChange = string => {
      setSearchString(string);
      setShowSearch(true);
    };

    const addSlider = () => {
      ageCategory == 'Adult'
        ? change('ages', concat(ages, [[20, 50]]))
        : change('ages', concat(ages, [[8, 16]]));
      //change('ages', concat(ages, [[20, 50]]));
    };

    const closeSlider = idx => {
      change('ages', concat(ages.slice(0, idx), ages.slice(idx + 1)));
    };

    const handleSelect = row => {
      if (row.selectedAges) {
        const selectedAgesArray = row.selectedAges
          .split(',')
          .map(ageGroup => ageGroup.split('-').map(age => parseInt(age)));

        // if (selectedAgesArray[0][1] > 20) {
        //   change('ageCategory', 'Adult');
        // } else {
        //   change('ageCategory', 'Children');
        // }
        //change('ages', selectedAgesArray);
      }

      if (row.selectedCountries) {
        const country = COUNTRIES.find(c => c.code == row.selectedCountries);
        change('countries', {
          value: country.code,
          label: `${country.emoji} ${t(`country.${country.twoCode}`)}`
        });
      }

      if (row.selectedEthnicities) {
        const raceEthnicity = row.selectedEthnicities.split(',').map(race => ({
          value: race,
          label: race
        }));
        change('raceEthnicity', raceEthnicity);
      }

      if (row.selectedGenders) {
        const genderOptions = t('gender', { returnObjects: true });
        const genders = row.selectedGenders.split(',').map(gender => ({
          label: genderOptions.find(
            genderTranslation => genderTranslation.value == gender
          ).label,
          value: gender
        }));

        change('gender', genders);
      }

      if (row.selectedSocioEcon) {
        const socioEconOptions = t('socioEcon', { returnObjects: true });
        const socioEcons = row.selectedSocioEcon.split(',').map(socioEcon => ({
          label: socioEconOptions.find(
            seTranslation => seTranslation.value == socioEcon
          ).label,
          value: socioEcon
        }));

        change('socioEcon', socioEcons);
      }

      if (row.selectedRegionTarget) {
        const regionTargetOptions = t('regionTarget', { returnObjects: true });
        const regionTargets = row.selectedRegionTarget
          .split(',')
          .map(regionTarget => ({
            label: regionTargetOptions.find(
              reTranslation => reTranslation.value == regionTarget
            ).label,
            value: regionTarget
          }));

        change('regionTarget', regionTargets);
      }

      // if (row.selectedSmokingHabits) {
      //   change('smokingHabits', row.selectedSmokingHabits);
      // }

      setShowSearch(false);
    };

    const currentCountry =
      countries && COUNTRIES.find(country => country.code === countries.value);

    const ageSliders = ages.map((age, i) => (
      <div className={styles.sliderContainer}>
        <AgeSlider
          key={i}
          ageCategory={ageCategory}
          value={age}
          disabled={displayMode}
          onChange={newValue =>
            change(
              'ages',
              ages.map((age, index) => (index === i ? newValue : age))
            )
          }
        />
        {ages.length > 1 &&
          !displayMode && (
            <IconButton onClick={() => closeSlider(i)}>
              <CloseIcon />
            </IconButton>
          )}
      </div>
    ));

    const experienceLevelSliders = experienceLevel.map((experience, i) => (
      <div className={styles.sliderContainer}>
        <ExperienceLevelSlider
          key={i}
          value={experience}
          disabled={false}
          onChange={newValue =>
            change(
              'experienceLevel',
              experienceLevel.map(
                (experience, index) => (index === i ? newValue : experience)
              )
            )
          }
        />
      </div>
    ));

    return (
      <div>
        {!displayMode && (
          <div>
            <h5 className={styles.productHeader}>{t('navigation.reports')}</h5>
            <h3 className={styles.productFieldsTitle}>
              {`${t('reports.createReportRequest')}: ${t(
                'reports.demographics'
              )}`}
            </h3>
          </div>
        )}

        {!displayMode && (
          <Grid container className={styles.searchBarContainer}>
            <Grid item xs={8}>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                value={searchString}
                onChange={event => handleChange(event.target.value)}
                placeholder={t('reports.searchPreviousReport')}
                // className={styles.searchBar}
                fullWidth
              />
            </Grid>
          </Grid>
        )}

        {searchString.length > 0 &&
          showSearch && (
            <DemographicTargetSearch
              query={searchString}
              hideSearch={() => setShowSearch(false)}
              first={10}
              onClick={row => handleSelect(row)}
            />
          )}

        <div className={styles.competitiveSetTable}>
          <table>
            <tbody>
              <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.countries')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {displayMode ? (
                    <div className={styles.tag}>
                      {countries && (
                        // For Multi country
                        // countries.map(country => (
                        //   <div key={country.label}>
                        //     <Tag readOnly={true} label={country.label} />
                        //   </div>
                        // ))}
                        <div key={countries.label}>
                          <Tag readOnly={true} label={countries.label} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Field
                      name="countries"
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      key="countries"
                      // options={COUNTRIES.map(country => ({
                      //   label: `${country.emoji} ${t(
                      //     `country.${country.code}`
                      //   )}`,
                      //   value: country.code
                      // }))}
                      options={COUNTRIES.map(country => ({
                        label: `${country.emoji} ${country.name}`,
                        value: country.code
                      }))}
                      isSearchable
                      isClearable
                      placeholder={t('reports.countryPlaceholder')}
                      // checkbox
                      // isMulti
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.gender')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {displayMode ? (
                    <div className={styles.tag}>
                      {/* {formValues.gender &&
                        formValues.gender.map(gender => (
                          <div key={gender.label}>
                            <Tag readOnly={true} label={gender.label} />
                          </div>
                        ))} */}
                      {formValues.gender.label}
                    </div>
                  ) : (
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
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.ages')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  <Field
                    name="ageCategory"
                    component={FormInputRadio}
                    key="ageCategory"
                    options={t('ageCategoryOptions', { returnObjects: true })}
                    required
                    disabled={displayMode}
                    onChange={e =>
                      e.target.value === 'Adult'
                        ? change('ages', [[20, 50]])
                        : change('ages', [[8, 16]])
                    }
                  />
                  {ageCategory && (
                    <React.Fragment>
                      {ageSliders}
                      {!displayMode && (
                        <MaterialButton size="small" onClick={addSlider}>
                          <AddIcon />
                          {t('reports.addAgeRange')}
                        </MaterialButton>
                      )}
                    </React.Fragment>
                  )}
                </td>
              </tr>

              <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.experienceLevel')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  <React.Fragment>{experienceLevelSliders}</React.Fragment>
                </td>
              </tr>

              {/* {currentCountry &&
                currentCountry.code == 'US' && (
                  <tr>
                    <td className={styles.fieldColumn}>
                      <span className={styles.fieldsLabel}>
                        {t('reports.raceEthnicity')}
                      </span>
                    </td>
                    <td className={styles.valueColumn}>
                      {displayMode ? (
                        <div className={styles.tag}>
                          {formValues.raceEthnicity &&
                            formValues.raceEthnicity.map(race => (
                              <div key={race.label}>
                                <Tag readOnly={true} label={race.label} />
                              </div>
                            ))}
                        </div>
                      ) : currentCountry ? (
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
                      {/* TODO */}
              {/* For Multiple Countries */}
              {/* {COUNTRIES.filter(country => countries && countries.find(c => c.value === country.code))
                      .map(country => !displayMode ? (
                        <Field
                        name={`raceEthnicity_${country.code}`}
                        component={FormInput}
                        inputComponent={FormInputSelect}
                        key={`raceEthnicity_${country.code}`}
                        options={country.raceAndEthnicity ?
                          country.raceAndEthnicity.map(race => ({ value: race, label: race }))
                          :
                          ([{ value: `General ${country.name}`, label: `General ${country.name}` }])
                        }
                        isSearchable
                        isClearable
                        placeholder={t('reports.racePlaceholder')}
                        checkbox
                        isMulti
                        customLabel
                        labelText={country.name}
                      />
                      ) : (
                        <div className={styles.tag}>
                          <div className={styles.raceEthnicityCountryHeader}>{country.name}</div>
                          {formValues[`raceEthnicity_${country.code}`] &&
                            formValues[`raceEthnicity_${country.code}`].map(race => (
                              <div key={race.label}>
                                <Tag readOnly={true} label={race.label} />
                              </div>
                            ))}
                        </div>
                      ))
                    } */}
              {/* </td>
                  </tr>
                )} */}

              {/* Smoking Habits removed for now */}
              {/* <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.smokingHabits')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {displayMode ? (
                    <span>{formValues.smokingHabits}</span>
                  ) : (
                    <Field
                      name="smokingHabits"
                      component={FormInputRadio}
                      key="smokingHabits"
                      required
                      options={t('smokingHabitsOptions', {
                        returnObjects: true
                      })}
                    />
                  )}
                </td>
              </tr> */}
              {/* <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.socioEconReportTitle')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {displayMode ? (
                    <div className={styles.tag}>
                      {formValues.socioEcon &&
                        formValues.socioEcon.map(socioEcon => (
                          <div key={socioEcon.label}>
                            <Tag readOnly={true} label={socioEcon.label} />
                          </div>
                        ))}
                    </div>
                  ) : (
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
                  )}
                </td>
              </tr> */}
              {/* <tr>
                <td className={styles.fieldColumn}>
                  <span className={styles.fieldsLabel}>
                    {t('reports.regionTarget')}
                  </span>
                </td>
                <td className={styles.valueColumn}>
                  {displayMode ? (
                    <div className={styles.tag}>
                      {formValues.regionTarget &&
                        formValues.regionTarget.map(regionTarget => (
                          <div key={regionTarget.label}>
                            <Tag readOnly={true} label={regionTarget.label} />
                          </div>
                        ))}
                    </div>
                  ) : (
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
                  )}
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Demographics);
