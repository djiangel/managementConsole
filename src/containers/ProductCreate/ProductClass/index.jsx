import React from 'react';
import { Field } from 'redux-form';
import { upperFirst } from 'lodash';
import FormInput from '../../../components/FormInput';
import FormInputTag from '../../../components/FormInputTag';
import styles from './ProductClass.module.css';
import { useTranslation } from 'react-i18next';

export default function ProductClass(props) {
  const { setProductClass, data } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.fieldContainer}>
      <Field
        name="productClass"
        component={FormInput}
        inputComponent={FormInputTag}
        onChange={(_, newValue) =>
          setProductClass(newValue.map(value => value.label))
        }
        key="productClass"
        placeholder={t('general.writeHere')}
        labelField="label"
        required
        customLabel
        labelText={t('product.productClass')}
        allowDeleteFromEmptyInput={false}
        suggestions={
          data.productClasses &&
          data.productClasses.nodes
            .map(({ id, name }) => ({
              label: name.toLowerCase(),
              id: id.toString()
            }))
            .filter(
              (e, index, array) =>
                array
                  .slice(index + 1)
                  .findIndex(element => e.label === element.label) === -1
            )
        }
      />
    </div>
  );
}
