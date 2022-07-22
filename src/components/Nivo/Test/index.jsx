import * as React from 'react';
import { ResponsiveLine } from '@nivo/line';

const commonProperties = {
  width: 900,
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x'
};

const Test = () => (
  <div style={{ height: 600 }}>
    <ResponsiveLine
      {...commonProperties}
      data={[
        {
          id: 'On budget :)',
          data: [
            { x: 0, y: 0.2 },
            { x: 1, y: 0.3 },
            { x: 2, y: 0.5 },
            // Skipped 3 and 4 so 2 and 5 are connected.
            { x: 5, y: 0.5 },
            { x: 6, y: 0.3 },
            { x: 7, y: 0.1 }
          ]
        },
        {
          id: 'Overshoot :(',
          data: [
            { x: 0, y: null },
            { x: 1, y: null },
            { x: 2, y: 0.5 },
            { x: 3, y: 0.8 },
            { x: 4, y: 0.9 },
            { x: 5, y: 0.5 },
            { x: 6, y: null },
            { x: 7, y: null }
          ]
        }
      ]}
      markers={[
        {
          // IDK why I had to add the as keyword (typescript)
          axis: 'x',
          value: 4,
          lineStyle: { stroke: '#b0413e', strokeWidth: 2 },
          legend: 'Mean'
        }
      ]}
      layers={[
        // IDK why I had to add the as keyword (typescript)
        'grid',
        'axes',
        'areas',
        'lines',
        'points',
        'slices',
        'mesh',
        'legends',
        // Add markers as the last one so it's on top
        'markers'
      ]}
      enableGridX={false}
      colors={['rgb(97, 205, 187)', 'rgb(244, 117, 96)']}
      xScale={{
        type: 'linear'
      }}
      yScale={{
        type: 'linear',
        stacked: false,
        min: 0,
        max: 1
      }}
      enableArea={true}
      areaOpacity={1}
      enableSlices={false}
      useMesh={true}
      crosshairType="cross"
    />
  </div>
);

export default Test;
