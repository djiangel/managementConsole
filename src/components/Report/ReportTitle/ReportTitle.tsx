import * as React from 'react';
import { useState, useEffect } from 'react';

import { compose, graphql } from 'react-apollo';
import * as moment from 'moment';

import ReportByIdQuery from '../../../graphql/queries/ReportByIdQuery';

interface ReportProps {
  reportId: string;
  reportJobsResults?: ReportJobResults;
}

interface ReportJobResults {
  loading: boolean
  error: any
  report: {
    clientName: string,
    projectName: string,
    startedAt: string,
    passedQa: boolean,
    reportId: string,
  }
}

interface ReportInfo {
  name: string;
  reportId: string;
}

const ReportTitle: React.FC<ReportProps> = (props) => {
  const { reportJobsResults } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportJobsResults
      && !reportJobsResults.loading
      && reportJobsResults.error === undefined) {
      setIsLoading(false);
    }
  });

  const getReshapedData = (reportJobsResults: ReportJobResults): ReportInfo =>
  ({
    name: formatReportName(reportJobsResults.report.clientName,
      reportJobsResults.report.projectName,
      reportJobsResults.report.startedAt),
    reportId: reportJobsResults.report.reportId
  } as ReportInfo);

  const formatReportName = (clientName: string, projectName: string, startedAt: string) => {
    return clientName + " - " + projectName + " - " + moment(startedAt).format('DD-MMM-YYYY HH:mm:ss');
  }

  if (isLoading) {
    return (<div />);
  }

  return (
    <h3>{getReshapedData(reportJobsResults).name}</h3>
  );
};

export default compose(
  graphql(ReportByIdQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportId: reportId,
        filter: { passedQa: { equalTo: true } },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true,
    }),
    name: 'reportJobsResults'
  })
)(ReportTitle);