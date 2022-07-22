import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../RequestReport.module.css';
import { REPORTS } from '../../../constants/routePaths';
import {
  IconButton,
  Paper,
  Grid,
  CircularProgress
} from '../../../material/index';
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { MARKET_SURVEY, PRODUCT } from '../../../constants/report';

export default function RequestSent({
  submitFailed,
  submitSucceeded,
  submitting,
  projectName,
  type
}) {
  const { t } = useTranslation();

  const typeString =
    type === MARKET_SURVEY
      ? t('reports.marketSurvey')
      : type === PRODUCT
        ? t('reports.productReport')
        : t('reports.optimization');
  return (
    <Paper className={styles.container}>
      <div className={styles.productHeader}>
        <IconButton
          component={Link}
          to={{ pathname: REPORTS }}
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
        {t('reports.createReportRequest')}
      </h3>

      <Grid container justify="center" direction="column" alignItems="center">
        {submitting && (
          <Grid item xs={12}>
            <CircularProgress color="secondary" />
          </Grid>
        )}
        {!submitting &&
          !submitFailed && (
            <Grid item xs={12}>
              <CheckCircleOutlineIcon
                style={{ fontSize: 150 }}
                color="secondary"
              />
            </Grid>
          )}
        {!submitting &&
          !submitFailed && (
            <Grid item xs={12}>
              <span className={styles.successHeader}>
                {t('reports.requestSuccessHeader')}
              </span>
            </Grid>
          )}
        {!submitting &&
          !submitFailed && (
            <Grid item xs={12}>
              <span
                className={styles.successHeader}
              >{`${projectName} ${typeString} ${t(
                'reports.reportRequest'
              )}`}</span>
            </Grid>
          )}
        {/* {!submitting &&
          !submitFailed && (
            <Grid item xs={12}>
              <span className={styles.successSubtitle}>
                {t('reports.requestSuccessSubtitle')}
              </span>
            </Grid>
          )} */}

        {!submitting &&
          submitFailed && (
            <Grid item xs={12}>
              <ErrorOutlineIcon style={{ fontSize: 150 }} color="error" />
            </Grid>
          )}
        {!submitting &&
          submitFailed && (
            <Grid item xs={12}>
              <span className={styles.successHeader}>
                {t('reports.requestFailedHeader')}
              </span>
            </Grid>
          )}
        {!submitting &&
          submitFailed && (
            <Grid item xs={12}>
              <span className={styles.successSubtitle}>
                {t('reports.requestFailedSubtitle')}
              </span>
            </Grid>
          )}
      </Grid>
    </Paper>
  );
}
