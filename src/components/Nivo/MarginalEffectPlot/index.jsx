import React from 'react';
import { ResponsiveLine } from '@nivo/line';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MarginalEffectPlot = () => {
  const data = [
    {
      id: 'Flavor',
      data: [-0.25, 0.12, 0, -0.21, -0.36, -0.4].map((y, i) => ({ x: i, y }))
    }
    // {
    //   id: 'fake corp. B',
    //   data: [
    //     0.9,
    //     0.5,
    //     0.6,
    //     0.5,
    //     0.4,
    //     0.3,
    //     -0.1,
    //     -0.5,
    //     -0.4,
    //     -0.4,
    //     -0.1,
    //     -0.3,
    //     -0.2,
    //     0.1,
    //     0.1,
    //     0.3,
    //     0.4,
    //     0.5,
    //     0.4,
    //     0.6,
    //     0.5,
    //     0.7,
    //     0.8,
    //     0.4,
    //     0.3,
    //   ].map((y, i) => ({ x: `#${i}`, y })),
    // },
  ];
  console.log(data);
  return (
    <div style={{ height: '200px', width: '300px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        curve="natural" // Make the curve
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
          },
          {
            axis: 'x',
            value: data[0].data.find(v => v.y == 0).x
          }
        ]}
        xScale={{ type: 'linear', min: -0.1, max: 5.1 }}
        yScale={{
          type: 'linear',
          min: -0.62,
          max: 0.24,
          stacked: true,
          reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Intensity',
          legendOffset: 36,
          legendPosition: 'middle',
          tickValues: 6
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'count',
          legendOffset: -40,
          legendPosition: 'middle',
          tickValues: 5
        }}
        colors={{ scheme: 'nivo' }}
        // Value 'Points'
        pointSize={6}
        pointColor={{ from: 'color' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        // legends={[
        //   {
        //     anchor: 'bottom-right',
        //     direction: 'column',
        //     justify: false,
        //     translateX: 100,
        //     translateY: 0,
        //     itemsSpacing: 0,
        //     itemDirection: 'left-to-right',
        //     itemWidth: 80,
        //     itemHeight: 20,
        //     itemOpacity: 0.75,
        //     symbolSize: 12,
        //     symbolShape: 'circle',
        //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemBackground: 'rgba(0, 0, 0, .03)',
        //           itemOpacity: 1
        //         }
        //       }
        //     ]
        //   }
        // ]}
      />
    </div>
  );
};

export default MarginalEffectPlot;
