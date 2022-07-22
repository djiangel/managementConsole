import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/FormInputTag/Tag';
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { capitalize } from 'lodash';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Link } from 'react-router-dom';
import { DEMOGRAPHIC_TARGETS } from '../../constants/routePaths';
import MaterialButton from 'components/MaterialButton';
const styles = require('./DemographicTarget.module.css');

const DemographicTargetCard = ({
  ages,
  socioEcon,
  genders,
  regionTarget,
  countries,
  raceEthnicity,
  smokingHabits,
  name,
  handleEditPress,
}) => {

  const { t } = useTranslation();

  const socioEconOptions: any[] = t('socioEcon', { returnObjects: true });
  const translatedSocioEcon =
    socioEcon &&
    socioEcon.map(
      se =>
        socioEconOptions.find(
          opt => opt.value.toLowerCase() === se.toLowerCase()
        ).label
    );

  const genderOptions: any[] = t('gender', { returnObjects: true });

  const translatedGenders =
    genders &&
    genders.map(
      g =>
        genderOptions.find(opt => opt.value.toLowerCase() === g.toLowerCase())
          .label
    );

  const regionTargetOptions: any[] = t('regionTarget', { returnObjects: true });
  const translatedRegionTarget =
    regionTarget &&
    regionTarget.map(
      rt =>
        regionTargetOptions.find(
          opt => opt.value.toLowerCase() === rt.toLowerCase()
        ).label
    );

  return (
    <Paper className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <div className={styles.headerTextContainer}>
            <IconButton
              component={Link}
              to={{ pathname: DEMOGRAPHIC_TARGETS }}
              size="small"
              style={{ marginLeft: -26 }}
            >
              <KeyboardBackspaceIcon fontSize="small" />
              <h5 className={styles.productHeader}>
                {t('navigation.demographicTargets')}
              </h5>
            </IconButton>
          </div>

          <h3 className={styles.productFieldsTitle}>{capitalize(name)}</h3>
        </div>
      </div>
      <div className={styles.headerActionContainer}>
            <MaterialButton
              onClick={handleEditPress}
              variant="outlined"
              soft
              teal
              style={{ width: 140, marginTop: 20 }}
            >
              {t('demographicTarget.edit')}
            </MaterialButton>
          </div>
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
                    <Tag key={age} readOnly={true} label={age} />
                  ))
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>

            <tr>
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
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.gender')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {translatedGenders ? (
                    translatedGenders.map(gender => (
                      <Tag key={gender} readOnly={true} label={gender} />
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
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
                <span>{smokingHabits || '-'}</span>
              </td>
            </tr>
            <tr>
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
            </tr>
            <tr>
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
            </tr>
          </tbody>
        </table>
      </div>
    </Paper>
  )
}

export default DemographicTargetCard;
