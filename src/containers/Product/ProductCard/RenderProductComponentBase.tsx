import * as React from 'react';
import { capitalize } from 'lodash';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productComponentBases: any[];
}

const RenderProductComponentBase: React.FunctionComponent<Props> = ({
  productComponentBases
}) => (
  <div className={styles.tag}>
    <FormInputTag
      defaultTags={productComponentBases.map(productComponentBase => ({
        label: capitalize(productComponentBase.productComponentBaseByProductComponentBaseId.name),
        id: productComponentBase.productComponentBaseByProductComponentBaseId.id.toString()
      }))}
      readOnly
      uneditable
    />
  </div>
);

export default RenderProductComponentBase;
