import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import data from './data';
import { zip } from 'lodash';
import { format } from 'd3-format';
import PointsLayer from './PointsLayer';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const DecompPlot = () => {
  const chartData = Object.entries(
    data['Philadelphia Cream Cheese']['dairy']
  ).map(ggvar => ({
    id: ggvar[0],
    data: zip(ggvar[1]['Decomp'], ggvar[1]['Effect_on_PQ']).map(item => ({
      x: format('%')(item[0]),
      y: item[1],
      symbol: ggvar[1].symbol[0],
      point:
        item[0] == ggvar[1]['current_Decomp'][0] &&
        item[1] == ggvar[1]['current_Effect_on_PQ'][0],
      bigPoint:
        item[0] == ggvar[1]['current_Opt_Decomp'][0] &&
        item[1] == ggvar[1]['current_Opt_Effect_on_PQ'][0]
    }))
  }));

  console.log(chartData);
  return (
    // <div style={{ height: '500px', width: '700px' }}>
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      curve="basis" // Make the curve
      // Horizontal line at y=0
      markers={[
        {
          axis: 'y', // axis the marker should be perpendicular to
          value: 0, // value of the marker in axis
          lineStyle: {
            stroke: 'red',
            strokeWidth: 1,
            strokeDasharray: '12, 6' // Make line dashed
          }
          // legend: 'y marker at 0',
          // legendPosition: 'bottom-left',
        }
        // {
        //   axis: 'x',
        //   value: data[0].data.find(v => v.y == 0).x,
        // }
      ]}
      xScale={{ type: 'linear', min: -0.5, max: 'auto' }}
      yScale={{ type: 'linear', min: -0.4, max: 0.4 }}
      axisTop={null}
      axisRight={null}
      layers={[
        'grid',
        'markers',
        'axes',
        'areas',
        'crosshair',
        'lines',
        'slices',
        'mesh',
        'legends',
        PointsLayer
      ]}
      axisBottom={{
        format: value => `${value}%`,
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Signature Decomp',
        legendOffset: 36,
        legendPosition: 'middle',
        tickValues: 6
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Effect on PQ',
        legendOffset: -40,
        legendPosition: 'middle',
        tickValues: 5
      }}
      colors={{ scheme: 'nivo' }}
      // Value 'Points'
      enablePoints={false}
      pointSize={6}
      pointColor={{ from: 'color' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel={item => item.y}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
    // </div>
  );
};

export default DecompPlot;
