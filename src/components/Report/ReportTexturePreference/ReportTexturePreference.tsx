import * as React from 'react';
import { useState, useEffect } from 'react';

import { filter, chain } from 'lodash';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReportTextureCompPrefQuery from '../../../graphql/queries/ReportTextureCompPrefQuery';
import ReportSummaryQuery from '../../../graphql/queries/ReportSummaryQuery';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';
import { report } from 'process';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportTexturePreferences?: reportTexturePreferencesResponse;
  reportSummary?: ReportSummaryResponse;
}

interface reportTexturePreferencesResponse {
  loading: boolean,
  error: any,
  allRpTextureCompPrefs: {
    nodes: [{
        clusterIdx: number,
        preference: string,
        productByProductId: {
            name: string
        }
    }]
  }
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
              id: number,
              name: string
            }
          }
        }]
      }
    }]
  }
}

const ReportTexturePreference: React.FC<ReportProps> = (props) => {
  const { t, reportTexturePreferences, reportSummary } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportTexturePreferences
      && !reportTexturePreferences.loading
      && reportTexturePreferences.error === undefined      
      && reportSummary
      && !reportSummary.loading
      && reportSummary.error === undefined) {
      setIsLoading(false);
    }
  });

  const getProductIds = (reportSummaryReponse: ReportSummaryResponse) => {
    return chain(reportSummaryReponse.allReportJobs.nodes[0].reportSummariesByReportId.edges.map(x => 
      x.node.productByProductId.id)).uniq().value();
  }

  const getReshapedData = (reportTextureCompPref: reportTexturePreferencesResponse, reportSummary: ReportSummaryResponse) => {
    const productIds = getProductIds(reportSummary);
    
    return chain(reportTextureCompPref.allRpTextureCompPrefs.nodes)
      .filter(node => productIds.includes(node.productByProductId.id))
      .groupBy("productByProductId.name")
      .map((value, key) => ({name: key, clusters: value }))
      .value();
  }

  const numberOfClusters = (reportTextureCompPref: reportTexturePreferencesResponse) => {
    return(chain(reportTextureCompPref.allRpTextureCompPrefs.nodes.map(row => row.clusterIdx)).uniq().value())
  }

  if (isLoading || getReshapedData(reportTexturePreferences, reportSummary).length === 0 ) {
    return (<div />);
  }


  return (
    <div>
        <h4>{t('reports.texturePreference.title')}</h4>
        <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.texturePreference.product')}</TableCell>
            <TableCell align="right">{t('reports.texturePreference.total')}</TableCell>
           
            {numberOfClusters(reportTexturePreferences).map((clusterId, key) => (
              <TableCell key={key} align="right">TC{clusterId}</TableCell>
            ))}

          </TableRow>
        </TableHead>
        <TableBody>
          {getReshapedData(reportTexturePreferences, reportSummary).map((row, key) => (
            <TableRow key={key}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.clusters.map(cluster => cluster.preference).reduce((prev, curr) => prev + curr, 0).toFixed(2)}</TableCell>
                
              {numberOfClusters(reportTexturePreferences).map((clusterId, key) => (
                <TableCell key={key} align="right">{filter(row.clusters, (x) => x.clusterIdx === clusterId)[0].preference.toFixed(2)}</TableCell>
              ))}

            </TableRow>
           ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default compose(
  withTranslation(),
  graphql(ReportTextureCompPrefQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
    name: "reportTexturePreferences"
  }),
  graphql(ReportSummaryQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
    name: "reportSummary"
  }),
)(ReportTexturePreference);