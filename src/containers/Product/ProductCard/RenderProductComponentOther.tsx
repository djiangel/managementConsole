import * as React from 'react';
import { capitalize } from 'lodash';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productComponentOthers: any[];
}

const RenderProductComponentOther: React.FunctionComponent<Props> = ({
  productComponentOthers
}) => (
  <div className={styles.tag}>
    <FormInputTag
      defaultTags={productComponentOthers.map(productComponentOther => ({
        label: capitalize(productComponentOther.productComponentOtherByProductComponentOtherId.name),
        id: productComponentOther.productComponentOtherByProductComponentOtherId.id.toString()
      }))}
      readOnly
      uneditable
    />
  </div>
);

export default RenderProductComponentOther;
