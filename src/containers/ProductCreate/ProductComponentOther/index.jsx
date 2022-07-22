import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductComponentOther.module.css';
import { useTranslation } from 'react-i18next';

export default function ComponentBaseOption({ data }) {
  const { t } = useTranslation();
  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productComponentOther"
        component={FormInput}
        inputComponent={FormInputTag}
        key="productComponentOther"
        customLabel
        labelText={t('product.productComponentOther')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.productComponentOthers &&
          data.productComponentOthers.nodes.map(({ id, name }) => ({
            label: name.toLowerCase(),
            id: id.toString()
          }))
        }
        minQueryLength={0}
        disableCustom
        modalText={t('product.productComponentOtherDesc')}
      />
    </div>
  );
}
