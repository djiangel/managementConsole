/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import DataSVGWithMargin, {
  contentContainerClassName,
  contentContainerBackgroundClassName
} from '../DataSVGWithMargin';

export const StyledSVG = styled(DataSVGWithMargin)`
  > .${contentContainerClassName} {
    > .${contentContainerBackgroundClassName} {
      fill: #fafafa;
    }

    .xAxis {
      transform: translateY(${({ height }) => height}px);

      text {
        font-size: 8px;
      }
    }

    .line path {
      fill: transparent;
      stroke: #29b6f6;
      stroke-width: 2;
    }

    .scatter circle {
      stroke: #fafafa;
      stroke-width: 2;
    }
  }
`;
