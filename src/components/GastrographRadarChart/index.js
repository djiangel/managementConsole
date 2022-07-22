import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import chartDataByGastrographEntry, {
  GastrographEntry
} from './chartDataByGastrographEntry';

type Props = {
  compact: ?boolean,
  gastrographEntry: GastrographEntry
};

const GastrographRadarChart = ({ compact, gastrographEntry }: Props) => {
  const chartData = chartDataByGastrographEntry(gastrographEntry);
  const height = compact ? 80 : 500;
  const width = compact ? 80 : 600;

  return (
    <RadarChart data={chartData} height={height} width={width}>
      <Radar
        dataKey="value"
        fill="#2196F3"
        fillOpacity={0.6}
        name="gastrograph"
        stroke="#2196F3"
      />
      <PolarGrid gridType="circle" />
      {compact || <PolarAngleAxis dataKey="label" />}
      <PolarRadiusAxis tick={false} tickCount={6} />
    </RadarChart>
  );
};

GastrographRadarChart.displayName = 'GastrographRadarChart';

export default GastrographRadarChart;
