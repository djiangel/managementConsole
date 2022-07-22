import * as React from 'react';
import { useState, useEffect } from 'react';
import { groupBy } from 'lodash';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReportTextureClustersQuery from '../../../graphql/queries/ReportTextureClusters';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportTextureClusters?: ReportTextureClusterResponse;
}

interface AllRpTextureClustersNode {
  clusterIdx: number;
  texture: string;
}

interface ReportTextureClusterResponse {
  loading: boolean,
  error: any,
  allRpTextureClusters: {
    nodes: [AllRpTextureClustersNode]
  }
}

const ReportTextureCluster: React.FC<ReportProps> = (props) => {
  const { t, reportTextureClusters, } = props;
  const [textureClusters, setTextureClusters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapAndRegroupClusterTextures = (textureClusters: AllRpTextureClustersNode[]) => {
    if (!textureClusters) return [];
    const groupedCluster = groupBy(textureClusters, 'clusterIdx');
    return Object.keys(groupedCluster).map(key => ({ [`TC${key}`] : groupedCluster[key].map(item => item.texture) }) )
  }

  useEffect(() => {
    if (reportTextureClusters
      && !reportTextureClusters.loading
      && reportTextureClusters.error === undefined) {
      setIsLoading(false);
      const loadedTextures = mapAndRegroupClusterTextures(reportTextureClusters.allRpTextureClusters.nodes);
      setTextureClusters(loadedTextures);
    }
  });

  if (isLoading || textureClusters.length === 0 ) {
    return (<div />);
  }

  return (
    <div>
      <h4>{t('reports.texturesSummary.title')}</h4>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('reports.texturesSummary.cluster')}</TableCell>            
            <TableCell align="left">{t('reports.texturesSummary.textures')}</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {textureClusters.map((row, i) => {
            const rowKey = Object.keys(row)[0];
            
            return (
              <TableRow key={'texturessummary_' + i}>
                <TableCell>{rowKey}</TableCell>
                <TableCell align="left">{row[rowKey].join(", ")}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default compose(
  withTranslation(),
  graphql(ReportTextureClustersQuery, {
    name: "reportTextureClusters",
    options: ({ reportId }: ReportProps) => ({
      variables: {
        reportID: reportId
      }
    }),
  }),
)(ReportTextureCluster);