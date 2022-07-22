import * as React from 'react';
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core';
import * as moment from 'moment';
import AllPanelVanityStatsQuery from '@graphql/queries/AllPanelVanityStatsQuery';
import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';

const styles = require('./PanelList.module.css');

interface Props {
  producerId: number;
  allPanels: any;
  yearPanels: any;
  monthPanels: any;
  weekPanels: any;
}

const PanelVanityStats: React.FunctionComponent<Props> = ({
  allPanels,
  yearPanels,
  monthPanels,
  weekPanels
}) => {
  const renderCard = (title, stats, size: any=3) => (
    <Grid item sm={size}>
      <Card>
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'subtitle1' }}
        />
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={styles.panelTitle} style={{ textAlign: 'center' }}>
            {stats}
          </span>
        </CardContent>
      </Card>
    </Grid>
  );

  const computeAverageProducts = () => {
    const totalPanels = get(allPanels, 'allPanels.totalCount');
    const totalProducts = get(allPanels, 'allPanels.nodes')
      .map(i => i.products.totalCount)
      .reduce((a, b) => a + b, 0);

    return totalProducts / totalPanels;
  };

  const computeAverageReviews = () => {
    const totalPanels = get(allPanels, 'allPanels.totalCount');
    const totalReviews = get(allPanels, 'allPanels.nodes')
      .map(i => i.reviews.totalCount)
      .reduce((a, b) => a + b, 0);

    return totalReviews / totalPanels;
  };

  if (
    allPanels.loading ||
    yearPanels.loading ||
    monthPanels.loading ||
    weekPanels.loading
  ) {
    return <div />;
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <Grid container spacing={3} direction="row">
        {renderCard('All Panels', get(allPanels, 'allPanels.totalCount'))}
        {renderCard(
          'Panels This Year',
          get(yearPanels, 'allPanels.totalCount')
        )}
        {renderCard(
          'Panels This Month',
          get(monthPanels, 'allPanels.totalCount')
        )}
        {renderCard(
          'Panels This Week',
          get(weekPanels, 'allPanels.totalCount')
        )}
        {renderCard('Average Number of Products', computeAverageProducts().toFixed(0), 6)}
        {renderCard('Average Number of Reviews', computeAverageReviews().toFixed(0), 6)}
      </Grid>
    </div>
  );
};

export default compose(
  graphql(AllPanelVanityStatsQuery, {
    options: ({ producerId }: any) => ({
      variables: { producerId, skipPanelInfo: false }
    }),
    name: 'allPanels'
  }),
  graphql(AllPanelVanityStatsQuery, {
    options: ({ producerId }: any) => ({
      variables: {
        producerId,
        filter: {
          endTime: {
            greaterThanOrEqualTo: moment()
              .startOf('year')
              .toISOString(),
          }
        }
      }
    }),
    name: 'yearPanels'
  }),
  graphql(AllPanelVanityStatsQuery, {
    options: ({ producerId }: any) => ({
      variables: {
        producerId,
        filter: {
          endTime: {
            greaterThanOrEqualTo: moment()
              .startOf('month')
              .toISOString(),
          }
        }
      }
    }),
    name: 'monthPanels'
  }),
  graphql(AllPanelVanityStatsQuery, {
    options: ({ producerId }: any) => ({
      variables: {
        producerId,
        filter: {
          endTime: {
            greaterThanOrEqualTo: moment()
              .startOf('isoWeek')
              .toISOString(),
          }
        }
      }
    }),
    name: 'weekPanels'
  })
)(PanelVanityStats);
