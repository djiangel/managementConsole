import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductFeature.module.css';
import { useTranslation } from 'react-i18next';

export default function FeatureOption({ data }) {
  const { t } = useTranslation();
  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productFeature"
        component={FormInput}
        inputComponent={FormInputTag}
        key="productFeature"
        customLabel
        labelText={t('product.productFeature')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.productFeatures &&
          data.productFeatures.nodes.map(({ id, name }) => ({
            label: name.toLowerCase(),
            id: id.toString()
          }))
        }
        minQueryLength={0}
        disableCustom
        required
        modalText={t('product.productFeatureDesc')}
      />
    </div>
  );
}
