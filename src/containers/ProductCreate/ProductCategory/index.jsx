import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductCategory.module.css';
import { useTranslation } from 'react-i18next';

export default function CategoryOption({ data, setProductCategory }) {
  const { t } = useTranslation();
  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productCategory"
        component={FormInput}
        inputComponent={FormInputTag}
        onChange={(_, newValue) =>
          setProductCategory(newValue[0] ? newValue[0].label : '')
        }
        key="productCategory"
        customLabel
        labelText={t('product.productCategory')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.productCategories &&
          data.productCategories.nodes.map(({ id, name }) => ({
            label: name.toLowerCase(),
            id: id.toString()
          }))
        }
        minQueryLength={0}
        single
        disableCustom
        required
        modalText={t('product.productCategoryDesc')}
      />
    </div>
  );
}
