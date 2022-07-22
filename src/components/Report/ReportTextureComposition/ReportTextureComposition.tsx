import * as React from 'react';
import { useState, useEffect } from 'react';

import { filter, chain } from 'lodash'; 
import { WithTranslation, withTranslation } from 'react-i18next';
import ReportTextureCompPrefQuery from '../../../graphql/queries/ReportTextureCompPrefQuery';
import ReportSummaryQuery from '../../../graphql/queries/ReportSummaryQuery';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportTextureComposition?: ReportTextureCompositionResponse;
  reportSummary?: ReportSummaryResponse;
}

interface ReportTextureCompositionResponse {
  loading: boolean,
  error: any,
  allRpTextureCompPrefs: {
    nodes: [{
      clusterIdx: number,
      composition: number,
      productByProductId: {
        id: number
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

const ReportTextureComposition: React.FC<ReportProps> = (props) => {
  const { t, reportTextureComposition, reportSummary } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportTextureComposition
      && !reportTextureComposition.loading
      && reportTextureComposition.error === undefined
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

  const getProductPqs = (reportSummaryResponse: ReportSummaryResponse) => {
    return chain(reportSummaryResponse.allReportJobs.nodes[0].reportSummariesByReportId.edges)
      .groupBy("node.productByProductId.id")
      .mapValues(v => ({pq: parseFloat(v[0].node.pq), name: v[0].node.productByProductId.name}))
      .value();
  }

  const getReshapedData = (reportTextureCompositionResponse: ReportTextureCompositionResponse, reportSummaryResponse: ReportSummaryResponse) => {
    const productIds = getProductIds(reportSummaryResponse);
    const productPqs = getProductPqs(reportSummaryResponse);

    return chain(reportTextureCompositionResponse.allRpTextureCompPrefs.nodes)
      .filter(node => productIds.includes(node.productByProductId.id))
      .groupBy("productByProductId.id")
      .map((value, key) => ({id: key, name: productPqs[key].name, pq: productPqs[key].pq, clusters: value }))
      .value();
  }

  const numberOfClusters = (reportTextureCompositionResponse: ReportTextureCompositionResponse) => {
    return chain(reportTextureCompositionResponse.allRpTextureCompPrefs.nodes.map(row => row.clusterIdx)).uniq().value();
  }



  if (isLoading || getReshapedData(reportTextureComposition, reportSummary).length === 0 ) {
    return (<div />);
  }


  return (
    <div>
      <h4>{t('reports.textureComposition.title')}</h4>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.textureComposition.product')}</TableCell>
            <TableCell align="right">{t('reports.textureComposition.pq')}</TableCell>
            {numberOfClusters(reportTextureComposition).map((clusterId, key) => (
              <TableCell key={key} align="right">TC{clusterId}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {getReshapedData(reportTextureComposition, reportSummary).map((row, key) => (
            <TableRow key={key}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.pq}</TableCell>
              
              {numberOfClusters(reportTextureComposition).map((clusterId, key) => (
                <TableCell key={key} align="right">{filter(row.clusters, (x) => x.clusterIdx === clusterId)[0].composition.toFixed(2)}</TableCell>
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
    name: "reportTextureComposition"
  }),
  graphql(ReportSummaryQuery, {
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
    name: "reportSummary"
  }),
)(ReportTextureComposition);