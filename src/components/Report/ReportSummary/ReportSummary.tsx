import * as React from 'react';
import { useState, useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import ReportSummaryQuery from '../../../graphql/queries/ReportSummaryQuery';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportSummary?: ReportSummaryResponse;
}

interface ReportSummaryResponse {
  loading: boolean,
  error: any,
  allReportJobs: {
    nodes: [{
      reportSummariesByReportId: {
        edges: [{
          node: {
            pComp: string,
            polarization: string,
            pq: string,
            productByProductId: {
              name: string
            }
          }
        }]
      }
    }]
  }
}

const ReportSummary: React.FC<ReportProps> = (props) => {
  const { t, reportSummary } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportSummary
      && !reportSummary.loading
      && reportSummary.error === undefined) {
      setIsLoading(false);
    }
  });

  const getReshapedData = (reportSummary: ReportSummaryResponse) => {
    return reportSummary.allReportJobs.nodes[0].reportSummariesByReportId.edges.map((edge, index) => ({
      key: index,
      name: edge.node.productByProductId.name,
      pq: parseFloat(edge.node.pq),
      pComp: parseInt(edge.node.pComp),
      polarization: parseFloat(edge.node.polarization)
    }));
  }

  if (isLoading) {
    return (<div />);
  }


  return (
    <div>
      <h4>{t('reports.summary.title')}</h4>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.summary.product')}</TableCell>
            <TableCell align="right">{t('reports.summary.pq')}</TableCell>
            <TableCell align="right">{t('reports.summary.winRate')}</TableCell>
            <TableCell align="right">{t('reports.summary.polarization')}</TableCell>
          </TableRow>
        </TableHead>
        {
          <TableBody>
            {getReshapedData(reportSummary).sort((a, b) => b.pq - a.pq).map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.pq}</TableCell>
                <TableCell align="right">{row.pComp}%</TableCell>
                <TableCell align="right">{row.polarization}</TableCell>
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
  graphql(ReportSummaryQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
    name: "reportSummary"
  }),
)(ReportSummary);