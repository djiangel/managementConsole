import * as React from 'react';
import { capitalize } from 'lodash';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productFeatures: any[];
}

const RenderProductFeature: React.FunctionComponent<Props> = ({
  productFeatures
}) => (
  <div className={styles.tag}>
    <FormInputTag
      defaultTags={productFeatures.map(productFeature => ({
        label: capitalize(productFeature.productFeatureByProductFeatureId.name),
        id: productFeature.productFeatureByProductFeatureId.id.toString()
      }))}
      readOnly
      uneditable
    />
  </div>
);

export default RenderProductFeature;
