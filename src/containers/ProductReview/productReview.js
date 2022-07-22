import React, { Component } from 'react';
import GastrographRadarChart from '../../components/GastrographRadarChart';

type Props = {
  // loading: boolean,
  productReview: Object
};

export default class ProductReviewContainer extends Component {
  props: Props;

  render() {
    const { productReview } = this.props;

    return (
      <div>
        {productReview && (
          <GastrographRadarChart gastrographEntry={productReview} />
        )}
      </div>
    );
  }
}
