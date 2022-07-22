import * as React from 'react';
import { useState, useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import ReportWorkspacesSummaryQuery from '../../../graphql/queries/ReportWorkspacesSummaryQuery';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportWorkspacesSummary?: ReportWorkspacesSummaryResponse;
}

interface ReportWorkspacesSummaryResponse {
  loading: boolean,
  error: any,
  allRpWorkspaceSummaries: {
    nodes: [{
        branch: string,
        reviewsConsidered: number,
        reviewsAnalyzed: number,
        signaturesConsidered: number,
        signaturesAnalyzed: number
    }]
  }
}

const ReportDataCollected: React.FC<ReportProps> = (props) => {
  const { t, reportWorkspacesSummary } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportWorkspacesSummary
      && !reportWorkspacesSummary.loading
      && reportWorkspacesSummary.error === undefined) {
      setIsLoading(false);
    }
  });

  if (isLoading) {
    return (<div />);
  }


  return (
    <div>
      <h4>{t('reports.workspaceSummary.dataCollected')}</h4>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.workspaceSummary.dataCollected')}</TableCell>
            <TableCell align="right">{t('reports.workspaceSummary.reviewsConsidered')}</TableCell>
            <TableCell align="right">{t('reports.workspaceSummary.reviewsAnalyzed')}</TableCell>
            <TableCell align="right">{t('reports.workspaceSummary.signaturesConsidered')}</TableCell>
            <TableCell align="right">{t('reports.workspaceSummary.signaturesAnalyzed')}</TableCell>
          </TableRow>
        </TableHead>
        {
          <TableBody>
            {reportWorkspacesSummary.allRpWorkspaceSummaries.nodes.map((row, i) => (
              <TableRow key={'workspacesummary_' + i}>
                <TableCell>{row.branch}</TableCell>
                <TableCell align="right">{row.reviewsConsidered}</TableCell>
                <TableCell align="right">{row.reviewsAnalyzed}</TableCell>
                <TableCell align="right">{row.signaturesConsidered}</TableCell>
                <TableCell align="right">{row.signaturesAnalyzed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        }
      </Table>
    </div>
  );
}

export default compose(
  withTranslation(),
  graphql(ReportWorkspacesSummaryQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
    name: "reportWorkspacesSummary"
  }),
)(ReportDataCollected);