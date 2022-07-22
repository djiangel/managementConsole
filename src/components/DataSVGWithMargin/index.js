import React from 'react';
import getMarginObject from './getMarginObject';

export const contentContainerClassName = 'contentContainer';
export const contentContainerBackgroundClassName = 'contentContainerBackground';

const getSVGDimensions = ({ height, margin, width }) => {
  const marginObject = getMarginObject(margin);
  const heightWithMargin = height + marginObject.top + marginObject.bottom;
  const widthWithMargin = width + marginObject.left + marginObject.right;

  return {
    height: heightWithMargin,
    width: widthWithMargin
  };
};

const getContentContainerStyle = ({ margin }) => {
  const marginObject = getMarginObject(margin);

  return {
    transform: `translate(${marginObject.left}px, ${marginObject.top}px)`
  };
};

type Props = {
  children: React$Element | React$Element[],
  height: number,
  margin: Object | number,
  width: number
};

const DataSVGWithMargin = ({
  children,
  height,
  width,
  margin,
  ...rest
}: Props) => (
  <svg
    {...rest}
    {...getSVGDimensions({
      height,
      margin,
      width
    })}
  >
    <g
      className={contentContainerClassName}
      style={getContentContainerStyle({ margin })}
    >
      <rect
        className={contentContainerBackgroundClassName}
        height={height}
        width={width}
        x={0}
        y={0}
      />
      {children}
    </g>
  </svg>
);

DataSVGWithMargin.displayName = 'DataSVGWithMargin';

export default DataSVGWithMargin;
