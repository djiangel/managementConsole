import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductTag.module.css';
import { useTranslation } from 'react-i18next';

export default function TagOption({ data }) {
  const { t } = useTranslation();
  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productTag"
        component={FormInput}
        inputComponent={FormInputTag}
        key="productTag"
        customLabel
        labelText={t('product.productTag')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.tags &&
          data.tags.nodes.map(({ id, tag }) => ({
            label: tag.toLowerCase(),
            id: id.toString()
          }))
        }
      />
    </div>
  );
}
