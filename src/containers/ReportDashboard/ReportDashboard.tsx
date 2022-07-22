import * as React from 'react';
import { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { withTranslation, WithTranslation } from 'react-i18next';

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { Grid, IconButton, Paper } from '../../material/index';
import * as moment from 'moment';

import AllReportsQuery from '../../graphql/queries/AllReportsQuery';
import ReportTitle from 'components/Report/ReportTitle';
import ReportSummary from 'components/Report/ReportSummary';
import ReportDataCollected from 'components/Report/ReportDataCollected';
import ReportMarketPreferences from 'components/Report/ReportMarketPreferences';
import ReportTextureCluster from 'components/Report/ReportTextureCluster';
import ReportTexturePreference from 'components/Report/ReportTexturePreference';
import ReportTextureComposition from 'components/Report/ReportTextureComposition';

const styles = require('./ReportDashboard.module.css');

interface Props extends WithTranslation {
  producerId?: number;
  reportJobsResults?: ReportJobResults;
  reportId: string;
}

interface ReportJobResults {
  loading: boolean
  error: any
  reports: {
    nodes: [{
      clientName: string,
      projectName: string,
      startedAt: string,
      passedQa: boolean,
      reportId: string,
    }]
  }
}

interface ReportInfo {
  key: number;
  name: string;
  reportId: string;
}

const ReportDashboard: React.FC<Props> = (props) => {
  const { t, reportJobsResults } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [reportId, setReportId] = useState("");

  useEffect(() => {
    if (reportJobsResults
      && !reportJobsResults.loading
      && reportJobsResults.error === undefined) {
      const loadedData = reportJobsResults &&
        reportJobsResults.reports &&
        reportJobsResults.reports.nodes;
      setIsLoading(false);
    }
  });

  const handleChange = (event) => setReportId(event.target.value);

  const getReshapedData = (reportJobsResults: ReportJobResults): ReportInfo[] =>
  (reportJobsResults.reports.nodes.map((report, index) => ({
    key: index,
    name: formatReportName(report.clientName, report.projectName, report.startedAt),
    reportId: report.reportId
  } as ReportInfo)));

  const formatReportName = (clientName: string, projectName: string, startedAt: string) => {
    return clientName + " - " + projectName + " - " + moment(startedAt).format('DD-MMM-YYYY HH:mm:ss');
  }

  if (isLoading) {
    return (<div />);
  }

  return (
    <Paper className={styles.container}>

      <h3 className={styles.productTitle}>{t('reports.dashboard')}</h3>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="report-id-select-label">{t('reports.report')}</InputLabel>
            <Select id="report-id-select" value={reportId} onChange={handleChange}>
              {getReshapedData(reportJobsResults).map((report) => (
                <MenuItem key={report.name} value={report.reportId}>{report.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {reportId ?
          <Grid container spacing={4}>
            <Grid item xs={10}>
              <ReportTitle reportId={reportId} />
            </Grid>
            <Grid item xs={10}>
              <ReportDataCollected reportId={reportId} />
            </Grid>
            <Grid item xs={10}>
              <ReportSummary reportId={reportId} />
            </Grid>
            <Grid item xs={10}>
              <ReportTextureCluster reportId={reportId} />
              </Grid>
            <Grid item xs={10}>
              <ReportTexturePreference reportId={reportId} />
            </Grid>
            <Grid item xs={10}>
              <ReportTextureComposition reportId={reportId} />
            </Grid>
            <Grid item xs={10}>
              <ReportMarketPreferences reportId={reportId} />
            </Grid>
          </Grid>
          : <div></div>}

      </Grid>
    </Paper>
  )
};

const mapStateToProps = commonState => ({
  producerId: selectWorkspaceProducerId(commonState)
});

export default compose(
  connect(
    mapStateToProps
  ),
  graphql(AllReportsQuery, {
    options: (props: any) => ({
      variables: {
        filter: { passedQa: { equalTo: true } },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true,
    }),
    name: 'reportJobsResults'
  }),
  withTranslation()
)(ReportDashboard);
