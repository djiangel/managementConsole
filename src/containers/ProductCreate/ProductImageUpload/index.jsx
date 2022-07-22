import React from 'react';
import { Field } from 'redux-form';
import FieldImageInput from '../../../components/FieldImageInput';
import styles from './ProductImageUpload.module.css';

export default function ProductImageUpload({ defaultImages, name }) {
  return (
    <div className={styles.fieldContainer}>
      <Field
        name={name}
        component={FieldImageInput}
        defaultImages={defaultImages}
        allowFileSizeValidation
        maxFileSize="200KB"
      />
    </div>
  );
}
