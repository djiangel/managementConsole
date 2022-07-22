import * as React from 'react';
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core';
import { get } from 'lodash';
import { compose, graphql } from 'react-apollo';
import AllPanelistVanityStatsQuery from '@graphql/queries/AllPanelistVanityStatsQuery';
import * as moment from 'moment';

const styles = require('./PanelUser.module.css');

interface Props {
  workspaceId: number;
  allPanelists: any;
  yearPanelists: any;
  monthPanelists: any;
  weekPanelists: any
}

const PanelUserVanityStats: React.FunctionComponent<Props> = ({
  allPanelists,
  yearPanelists,
  monthPanelists,
  weekPanelists
}) => {
  const renderCard = (title, stats, size: any = 3) => (
    <Grid item sm={size}>
      <Card>
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'subtitle1' }}
        />
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={styles.userTitle} style={{ textAlign: 'center' }}>
            {stats}
          </span>
        </CardContent>
      </Card>
    </Grid>
  );

  if (
    allPanelists.loading ||
    yearPanelists.loading ||
    monthPanelists.loading ||
    weekPanelists.loading
  ) {
    return <div />;
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <Grid container spacing={3} direction="row">
        {renderCard('All Panelists', get(allPanelists, 'allPanelists.totalCount'))}
        {renderCard(
          'Panelists This Year',
          get(yearPanelists, 'allPanelists.totalCount')
        )}
        {renderCard(
          'Panelists This Month',
          get(monthPanelists, 'allPanelists.totalCount')
        )}
        {renderCard(
          'Panelists This Week',
          get(weekPanelists, 'allPanelists.totalCount')
        )}
      </Grid>
    </div>
  );
};

export default compose(
  graphql(AllPanelistVanityStatsQuery, {
    options: ({ workspaceId }: any) => ({
      variables: { workspaceId }
    }),
    name: 'allPanelists'
  }),
  graphql(AllPanelistVanityStatsQuery, {
    options: ({ workspaceId }: any) => ({
      variables: {
        workspaceId,
        filter: {
          lastActive: {
            greaterThanOrEqualTo: moment()
              .startOf('year')
              .toISOString()
          }
        }
      }
    }),
    name: 'yearPanelists'
  }),
  graphql(AllPanelistVanityStatsQuery, {
    options: ({ workspaceId }: any) => ({
      variables: {
        workspaceId,
        filter: {
          lastActive: {
            greaterThanOrEqualTo: moment()
              .startOf('month')
              .toISOString()
          }
        }
      }
    }),
    name: 'monthPanelists'
  }),
  graphql(AllPanelistVanityStatsQuery, {
    options: ({ workspaceId }: any) => ({
      variables: {
        workspaceId,
        filter: {
          lastActive: {
            greaterThanOrEqualTo: moment()
              .startOf('isoWeek')
              .toISOString()
          }
        }
      }
    }),
    name: 'weekPanelists'
  })
)(PanelUserVanityStats);
