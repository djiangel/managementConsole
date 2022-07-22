import * as React from 'react';
import { upperFirst } from 'lodash';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productClasses: any[];
}

const RenderProductClass: React.FunctionComponent<Props> = ({
  productClasses
}) => (
  <div className={styles.tag}>
    <FormInputTag
      defaultTags={productClasses.map(productClass => ({
        label: productClass.productClassByProductClassId.name.toLowerCase(),
        id: productClass.productClassByProductClassId.id.toString()
      }))}
      readOnly
      uneditable
    />
  </div>
);

export default RenderProductClass;
