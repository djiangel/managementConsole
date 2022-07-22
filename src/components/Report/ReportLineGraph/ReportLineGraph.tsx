import * as React from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'react-apollo';
import { ResponsiveLine } from '@nivo/line'

interface ReportProps extends WithTranslation {
  data: any;
}

const ReportLineGraph: React.FC<ReportProps> = (props) => {
  const { t, data } = props;

  return (
    <div style={{height:"500px"}}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 110, bottom: 70, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'PQ Rating',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Percent of Population',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
    />
    </div>
  );
}

export default compose()(ReportLineGraph);