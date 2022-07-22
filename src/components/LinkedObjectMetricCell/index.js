import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  renderIntent: ?() => React$Element,
  title: string,
  value: any
};

const LinkedObjectMetricCell = ({
  renderIntent,
  title,
  value,
  ...rest
}: Props) => (
  <StyledContainerDiv {...rest}>
    <div className="header">{title}</div>
    <div className="contentWrapper">
      <div className="value">{value}</div>
      {!!renderIntent && <div className="intentWrapper">{renderIntent()}</div>}
    </div>
  </StyledContainerDiv>
);

LinkedObjectMetricCell.displayName = 'LinkedObjectMetricCell';

export default LinkedObjectMetricCell;
