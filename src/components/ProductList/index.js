/* eslint-disable react/no-array-index-key */
import { chunk, size, times } from 'lodash';
import React from 'react';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  cellsPerRow?: number,
  products: Object[],
  renderProduct: (product: Object) => React$Element
};

const ProductList = ({
  cellsPerRow,
  renderProduct,
  products,
  ...rest
}: Props) => (
  <StyledContainerDiv {...rest}>
    {chunk(products, cellsPerRow).map((productsRow, index) => (
      <div className="row" key={index}>
        {productsRow.map(product => (
          <div className="cellWrapper">{renderProduct(product)}</div>
        ))}
        {size(productsRow) < cellsPerRow &&
          times(cellsPerRow - size(productsRow), () => (
            <div className="cellWrapper" />
          ))}
      </div>
    ))}
  </StyledContainerDiv>
);

ProductList.defaultProps = {
  cellsPerRow: 4
};
ProductList.displayName = 'ProductList';

export default ProductList;
