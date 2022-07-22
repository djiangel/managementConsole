import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../RequestReport.module.css';
import Demographics from '../Demographics';
import MarketSurvey from '../MarketSurvey';
import Optimization from '../Optimization';
import {
  MARKET_SURVEY,
  PRODUCT,
  OPTIMIZATION
} from '../../../constants/report';

export default function Confirmation(props) {
  const { t } = useTranslation();
  return (
    <div>
      <h5 className={styles.productHeader}>{t('navigation.reports')}</h5>
      <h3 className={styles.productFieldsTitle}>
        {`${t('reports.createReportRequest')}: ${t('reports.confirmation')}`}
      </h3>

      <div className={styles.competitiveSetTable}>
        <table>
          <tbody>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>{t('reports.type')}</span>
              </td>
              <td className={styles.valueColumn}>
                <span>{props.type.label}</span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.projectName')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{props.projectName}</span>
              </td>
            </tr>
            {/* <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.includeTexture')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>
                  {props.includeTexture ? t('forms.yes') : t('forms.no')}
                </span>
              </td>
            </tr> */}
            {(props.producerId == 25 || props.producerId == 209) &&
              props.type.value === OPTIMIZATION && (
                <tr>
                  <td className={styles.fieldColumn}>
                    <span className={styles.fieldsLabel}>
                      {t('reports.testMode')}
                    </span>
                  </td>
                  <td className={styles.valueColumn}>
                    <span>
                      {props.testMode ? t('forms.yes') : t('forms.no')}
                    </span>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div>
        {(props.type.value === MARKET_SURVEY ||
          props.type.value === PRODUCT) && (
          <MarketSurvey displayMode={true} {...props} />
        )}
        {props.type.value === OPTIMIZATION && (
          <Optimization displayMode={true} {...props} />
        )}
      </div>

      <div className={styles.sectionContainer}>
        <span className={styles.sectionHeader}>
          {t('reports.demographics')}
        </span>
      </div>
      <div className={styles.competitiveSetTable}>
        <Demographics displayMode={true} {...props} />
      </div>
    </div>
  );
}
