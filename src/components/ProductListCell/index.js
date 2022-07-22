import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  name: string
};

const ProductListCell = ({ name, ...rest }: Props) => (
  <StyledContainerDiv {...rest}>
    <div>{name}</div>
  </StyledContainerDiv>
);

ProductListCell.displayName = 'ProductListCell';

export default ProductListCell;
