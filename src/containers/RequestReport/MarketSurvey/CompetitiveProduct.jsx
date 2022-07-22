import React from 'react';
import { useState } from 'react';
import styles from '../RequestReport.module.css';
import Tag from '../../../components/FormInputTag/Tag';
import FieldCheckBox from '../../../components/FieldCheckBox';
import FieldTextInput from '../../../components/FieldTextInput';
import { Field } from 'redux-form';

export default function CompetitiveProduct({
  product,
  deleteProduct,
  displayMode,
  handleVisibilityChange,
  handleNameChange
}) {
  const nameId = `${product.name}-${product.id}`;
  const renameId = `new-${product.name}-${product.id}`;
  const visibleId = `visible-${product.id}`;
  console.log(product);
  return (
    <tr key={product.id} displayMode={displayMode}>
      <td className={styles.colName}>
        <Tag
          readOnly={displayMode}
          label={product.name}
          onDelete={() => deleteProduct(product.id)}
          name={nameId}
          className="name"
          data-idx={product.id}
        />
      </td>
      <td className={styles.colRename}>
        {product &&
          product.visible && (
            <Field
              style={{
                marginTop: 20,
                width: 350
              }}
              name={renameId}
              disabled={displayMode ? true : false}
              className="rename"
              data-idx={product.id}
              onChange={e => handleNameChange(product.id, e.target.value)}
              component={FieldTextInput}
              value={product['rename']}
              required
            />
          )}
      </td>
      <td className={styles.colCheck}>
        <Field
          name={product.name}
          component={FieldCheckBox}
          val={product.visible}
          name={visibleId}
          disabled={displayMode ? true : false}
          className="visible"
          onClick={event => event.stopPropagation()}
          //onFocus={event => event.stopPropagation()}
          onChange={() => {
            handleVisibilityChange(product.id);
          }}
          required
        />
      </td>
    </tr>
  );
}
