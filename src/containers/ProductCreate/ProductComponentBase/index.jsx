import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductComponentBase.module.css';
import { useTranslation } from 'react-i18next';

export default function ComponentBaseOption({ data }) {
  const { t } = useTranslation();
  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productComponentBase"
        component={FormInput}
        inputComponent={FormInputTag}
        key="productComponentBase"
        customLabel
        labelText={t('product.productComponentBase')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.productComponentBases &&
          data.productComponentBases.nodes.map(({ id, name }) => ({
            label: name.toLowerCase(),
            id: id.toString()
          }))
        }
        minQueryLength={0}
        disableCustom
        required
        modalText={t('product.productComponentBaseDesc')}
      />
    </div>
  );
}
