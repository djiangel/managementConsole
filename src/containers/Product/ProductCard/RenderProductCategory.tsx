import * as React from 'react';
import { capitalize } from 'lodash';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productCategory: any;
}

const RenderProductCategory: React.FunctionComponent<Props> = ({
  productCategory
}) => (
  <div className={styles.tag}>
    <FormInputTag
      defaultTags={productCategory ? [{
        label: capitalize(productCategory.name),
        id: productCategory.id.toString()
      }] : []}
      readOnly
      uneditable
    />
  </div>
);

export default RenderProductCategory;
