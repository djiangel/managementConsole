import {
  max as d3ArrayMaximum,
  min as d3ArrayMinimum,
  extent as d3ArrayExtent
} from 'd3-array';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from 'd3-axis';
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { timeDay as d3TimeDay } from 'd3-time';
import React from 'react';
import { StyledSVG } from './StyledComponents';

type Props = {
  data: any,
  height: number,
  width: number,
  margin: Object | number,
  selectX: (datum: any) => any,
  selectY: (datum: any) => any
};

const DataSparkLine = ({
  data,
  height,
  margin,
  selectX,
  selectY,
  width
}: Props) => {
  const xScale = d3ScaleTime()
    .nice(d3TimeDay)
    .domain(d3ArrayExtent(data, selectX))
    .range([0, width]);
  const yScale = d3ScaleLinear()
    .domain(d3ArrayExtent(data, selectY))
    .range([height, 0]);

  const xAxis = d3AxisBottom()
    .scale(xScale)
    .ticks(data.length / 2);
  const yAxis = d3AxisLeft()
    .scale(yScale)
    .ticks(3);

  const selectScaledX = datum => xScale(selectX(datum));
  const selectScaledY = datum => yScale(selectY(datum));

  const sparkLine = d3Line()
    .x(selectScaledX)
    .y(selectScaledY);

  const pastCircleColor = '#5c6bc0';
  const futureCircleColor = '#9fa8da';
  const circlesFillScale = d3ScaleTime()
    .nice(d3TimeDay)
    .domain([
      d3ArrayMinimum(data, selectX),
      new Date(),
      d3ArrayMaximum(data, selectX)
    ])
    .range([pastCircleColor, pastCircleColor, futureCircleColor]);

  const linePath = sparkLine(data);
  const circlePoints = data.map(datum => ({
    fill: circlesFillScale(selectX(datum)),
    x: selectScaledX(datum),
    y: selectScaledY(datum)
  }));

  return (
    <StyledSVG height={height} margin={margin} width={width}>
      <g className="xAxis" ref={node => d3Select(node).call(xAxis)} />
      <g className="yAxis" ref={node => d3Select(node).call(yAxis)} />
      <g className="line">
        <path d={linePath} />
      </g>
      <g className="scatter">
        {circlePoints.map(circlePoint => (
          <circle
            cx={circlePoint.x}
            cy={circlePoint.y}
            fill={circlePoint.fill}
            key={`${circlePoint.x},${circlePoint.y}`}
            r={4}
          />
        ))}
      </g>
    </StyledSVG>
  );
};

DataSparkLine.displayName = 'DataSparkLine';

export default DataSparkLine;
