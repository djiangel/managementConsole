import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { MARKET_SURVEY, PRODUCT, OPTIMIZATION } from '../../constants/report';
import OptimizationReportByIdQuery from '../../graphql/queries/OptimizationReportByIdQuery';
import MarketSurveyReportByIdQuery from '../../graphql/queries/MarketSurveyReportByIdQuery';
import LoadingScreen from '../../components/LoadingScreen';
import {
  Input,
  InputAdornment,
  LinearProgress,
  IconButton,
  Paper
} from '@material-ui/core';
import { KeyboardBackspace as KeyboardBackspaceIcon } from '@material-ui/icons';
import MarketSurvey from './MarketSurvey';
import Optimization from './Optimization';
import Demographics from './Demographics';
import { useTranslation } from 'react-i18next';
import PDFDownloadQuery from '../../graphql/queries/PDFDownloadQuery';
import graphqlClient from 'consumers/graphqlClient';
import { RouterProps } from 'react-router';

const styles = require('./Report.module.css');

interface Props extends RouterProps {
  match: Record<string, any>;
}

export default function Report(props: Props) {
  const { match, history } = props;

  const { t } = useTranslation();

  const [reportLink, setReportLink] = React.useState('');

  const reportType = decodeURI(match.params.reportType);
  const query =
    reportType === OPTIMIZATION
      ? OptimizationReportByIdQuery
      : MarketSurveyReportByIdQuery;

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: parseInt(match.params.reportId)
    }
  });
  if (loading) {
    return <LoadingScreen />;
  }

  const fields = data.report;
  fields.pdfLink &&
    graphqlClient
      .query({
        query: PDFDownloadQuery,
        variables: {
          pdfName: fields.pdfLink,
          reportType: reportType === OPTIMIZATION ? 'opt' : 'mkt_survey'
        }
      })
      .then(
        resp =>
          !!resp.data.pdfDownloadQuery &&
          setReportLink(resp.data.pdfDownloadQuery)
      );

  return (
    <Paper className={styles.container}>
      <div className={styles.productHeader}>
        <IconButton
          onClick={history.goBack}
          size="small"
          style={{ marginLeft: -26 }}
        >
          <KeyboardBackspaceIcon fontSize="small" />
          <h5 style={{ marginTop: '0.65em' }} className={styles.productHeader}>
            {t('navigation.reports')}
          </h5>
        </IconButton>
      </div>
      <h3 className={styles.productFieldsTitle}>
        {reportType === MARKET_SURVEY
          ? t('reports.marketSurvey')
          : reportType === OPTIMIZATION
            ? t('reports.optimization')
            : t('reports.productReport')}
      </h3>

      <div className={styles.competitiveSetTable}>
        <table>
          <tbody>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.projectName')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{fields.projectName}</span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.demographic')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{fields.demographic}</span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.client')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{fields.client}</span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.includeTexture')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>
                  {fields.includeTexture ? t('forms.yes') : t('forms.no')}
                </span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.status')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{fields.status}</span>
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.download')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                {reportLink && (
                  <a target="_blank" href={reportLink}>
                    {t('reports.pdfLink')}
                  </a>
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.revisionComment')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>{fields.comment}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        {(reportType === MARKET_SURVEY || reportType === PRODUCT) && (
          <MarketSurvey
            products={fields.productIds && fields.productIds.split(',')}
            reanamedProducts={fields.renamedProducts && JSON.parse(fields.renamedProducts)}
          />
        )}
        {reportType === OPTIMIZATION && (
          <Optimization
            products={fields.productIds && fields.productIds.split(',')}
            newReferenceFlavor={fields.newReferenceFlavor}
            gravityConstraint={
              fields.gravityConstraint && fields.gravityConstraint.split(',')
            }
            // constraintLevel={
            //   fields.constraintLevel && fields.constraintLevel.split(',')
            // }
            constraintLevel={fields.constraintLevel}
          />
        )}
      </div>

      <div className={styles.sectionContainer}>
        <span className={styles.sectionHeader}>
          {t('reports.demographics')}
        </span>
      </div>
      <div className={styles.competitiveSetTable}>
        <Demographics
          countries={
            fields.selectedCountries && fields.selectedCountries.split(',')
          }
          raceEthnicity={
            fields.selectedEthnicities && fields.selectedEthnicities.split(',')
          }
          ages={fields.selectedAges && fields.selectedAges.split(',')}
          // genders={fields.selectedGenders && fields.selectedGenders.split(',')}
          genders={fields.selectedGenders}
          experienceLevel={fields.experienceRange && fields.experienceRange.split(',')}
          smokingHabits={
            fields.selectedSmokingHabits &&
            fields.selectedSmokingHabits.split(',')
          }
          socioEcon={
            fields.selectedSocioEcon && fields.selectedSocioEcon.split(',')
          }
          regionTarget={
            fields.selectedRegionTarget &&
            fields.selectedRegionTarget.split(',')
          }
        />
      </div>
    </Paper>
  );
}
