import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Report.module.css';
import Tag from '../../../components/FormInputTag/Tag';

export default function Demographics(props) {
  const {
    countries,
    ages,
    raceEthnicity,
    socioEcon,
    regionTarget,
    smokingHabits,
    genders,
    experienceLevel
  } = props;

  const { t } = useTranslation();

  const socioEconOptions = t('socioEcon', { returnObjects: true });
  const translatedSocioEcon =
    socioEcon &&
    socioEcon.map(
      se =>
        socioEconOptions.find(
          opt => opt.value.toLowerCase() === se.toLowerCase()
        ).label
    );

  const genderOptions = t('gender', { returnObjects: true });
  // const translatedGenders =
  //   genders &&
  //   genders.map(
  //     g =>
  //       genderOptions.find(opt => opt.value.toLowerCase() === g.toLowerCase())
  //         .label
  //   );

  const regionTargetOptions = t('regionTarget', { returnObjects: true });
  const translatedRegionTarget =
    regionTarget &&
    regionTarget.map(
      rt =>
        regionTargetOptions.find(
          opt => opt.value.toLowerCase() === rt.toLowerCase()
        ).label
    );

  return (
    <div>
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
                <div className={styles.tag}>
                  <Tag key={countries} readOnly={true} label={countries} />
                </div>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>{t('reports.ages')}</span>
              </td>
              <td className={styles.valueColumn}>
                {ages ? (
                  ages.map(age => (
                    <Tag key={age} readOnly={true} label={ages} />
                  ))
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>

            {/* <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.raceEthnicity')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {raceEthnicity ? (
                    raceEthnicity.map(race => (
                      <Tag key={race} readOnly={true} label={race} />
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </td>
            </tr> */}
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.gender')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {/* {translatedGenders ? (
                    translatedGenders.map(gender => (
                      <Tag key={gender} readOnly={true} label={gender} />
                    ))
                  ) : (
                    <span>-</span>
                  )} */}
                  <span>{genders}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.experienceLevel')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                {experienceLevel && experienceLevel[1] ? (
                  <span>
                    {experienceLevel[0].substring(1, 2)} -{' '}
                    {experienceLevel[1].substring(0, 1)}
                  </span>
                ) : (
                  <span>{experienceLevel && experienceLevel[0]}</span>
                )}
              </td>
            </tr>

            {/* Smoking Habits removed for now */}
            {/* <tr>
              <td2 className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.smokingHabits')}
                </span>
              </td2
              <td className={styles.valueColumn}>
                <span>{smokingHabits || '-'}</span>
              </td>
            </tr> */}
            {/* <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.socioEcon')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {translatedSocioEcon ? (
                    translatedSocioEcon.map(socioEcon => (
                      <Tag key={socioEcon} readOnly={true} label={socioEcon} />
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </td>
            </tr> */}
            {/* <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.regionTarget')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {translatedRegionTarget ? (
                    translatedRegionTarget.map(regionTarget => (
                      <Tag
                        key={regionTarget}
                        readOnly={true}
                        label={regionTarget}
                      />
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
