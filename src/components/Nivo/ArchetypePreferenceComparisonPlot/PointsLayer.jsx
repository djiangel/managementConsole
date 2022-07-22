import React from 'react';
import { DotsItem } from '@nivo/core';
import { capitalize } from 'lodash';

const PointsLayer = ({ series, points, ...props }) => {
  const symbol = ({ size, color, borderWidth, borderColor }) => (
    <circle
      r={size / 2}
      fill={color}
      stroke={borderColor}
      strokeWidth={borderWidth}
      style={{ pointerEvents: 'none' }}
    />
  );

  return (
    <React.Fragment>
      {points
        .filter(point => point.data.point || point.data.bigPoint)
        .map(point => (
          <DotsItem
            key={point.id}
            x={point.x}
            y={point.y}
            datum={point.data}
            symbol={symbol}
            size={point.data.bigPoint ? 10 : 6}
            color={point.color}
            borderWidth={2}
            borderColor={point.borderColor}
            label={
              point.data.bigPoint
                ? capitalize(point.data.symbol)
                : point.data.symbol
            }
            labelYOffset={25}
            theme={{
              dots: {
                text: {
                  color: point.color
                }
              }
            }}
          />
        ))}
    </React.Fragment>
  );
};

export default PointsLayer;
