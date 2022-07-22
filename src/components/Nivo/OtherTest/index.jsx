import * as React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { area, curveMonotoneX } from 'd3-shape';
import { Defs } from '@nivo/core';

const MyResponsiveLine = () => {
  const AreaLayer = ({ series, xScale, yScale, innerHeight, markers }) => {
    // console.log(markers);
    const areaGenerator = area()
      .x(d => xScale(d.data.x))
      .y0(d => Math.min(innerHeight, yScale(d.data.y - 4)))
      .y1(d => yScale(d.data.y + 1))
      .curve(curveMonotoneX);

    return (
      <React.Fragment>
        <Defs
          defs={[
            {
              id: 'pattern',
              type: 'patternLines',
              background: 'transparent',
              color: '#3daff7',
              lineWidth: 1,
              spacing: 6,
              rotation: -45
            }
          ]}
        />
        <path
          d={areaGenerator(series[0].data)}
          fill="url(#pattern)"
          fillOpacity={0.6}
          stroke="#3daff7"
          strokeWidth={2}
        />
      </React.Fragment>
    );
  };

  //   const styleById = {
  //     cognac: {
  //         strokeDasharray: '12, 6',
  //         strokeWidth: 2,
  //     },
  //     vodka: {
  //         strokeDasharray: '1, 16',
  //         strokeWidth: 8,
  //         strokeLinejoin: 'round',
  //         strokeLinecap: 'round',
  //     },
  //     rhum: {
  //         strokeDasharray: '6, 6',
  //         strokeWidth: 4,
  //     },
  //     default: {
  //         strokeWidth: 1,
  //     },
  //   }

  //   const DashedLine = ({ series, lineGenerator, xScale, yScale }) => {
  //     return series.map(({ id, data, color }) => (
  //         <path
  //             key={id}
  //             d={lineGenerator(
  //                 data.map(d => ({
  //                     x: xScale(d.data.x),
  //                     y: yScale(d.data.y),
  //                 }))
  //             )}
  //             fill="none"
  //             stroke={color}
  //             style={styleById[id] || styleById.default}
  //         />
  //     ))
  // }
  return (
    <ResponsiveLine
      data={[
        {
          id: 'PQ Distribution',
          color: 'hsl(174, 70%, 50%)',
          data: [
            {
              x: 1,
              y: 0.2
            },
            {
              x: 2,
              y: 6.2
            },
            {
              x: 3,
              y: 2.8
            },
            {
              x: 4,
              y: 17
            },
            {
              x: 5,
              y: 40.3
            },
            {
              x: 6,
              y: 32.9
            },
            {
              x: 7,
              y: 0.6
            }
          ]
        }
      ]}
      markers={[
        {
          // axis: "x" as "x",
          axis: 'x',
          value: 4.911,
          lineStyle: { stroke: '#b0413e', strokeWidth: 1 },
          legend: 'Mean'
        },
        {
          axis: 'x',
          value: 4.358990263,
          lineStyle: { stroke: '#b0413e', strokeWidth: 1 }
          // legend: "A"
        },
        {
          axis: 'x',
          value: 5.463009737,
          lineStyle: { stroke: '#b0413e', strokeWidth: 1 }
          // legend: "B"
        }
      ]}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yScale={{
        type: 'linear',
        min: 0,
        max: 'auto',
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
        legend: 'PQ Rating',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Percent of Population',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      layers={[
        // // IDK why I had to add the as keyword (typescript)
        // "grid" as "grid",
        // "axes" as "axes",
        // "areas" as "areas",
        // AreaLayer as AreaLayer,
        // "lines" as "lines",
        // "points" as "points",
        // "slices" as "slices",
        // "mesh" as "mesh",
        // "legends" as "legends",
        // // Add markers as the last one so it's on top
        // "markers" as "markers"

        // IDK why I had to add the as keyword (typescript)
        'grid',
        'axes',
        'areas',
        AreaLayer,
        'lines',
        'points',
        'slices',
        'mesh',
        'legends',
        // Add markers as the last one so it's on top
        'markers'
      ]}
      colors={{ scheme: 'nivo' }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'right',
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
  );
};
export default MyResponsiveLine;
