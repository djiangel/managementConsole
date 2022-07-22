import React from 'react';
import { Field, WrappedFieldArrayProps } from 'redux-form';
import FieldTextInput from '../FieldTextInput';
import Fab from '@material-ui/core/Fab';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import styles from './index.css';

let fields = ({ fields }: WrappedFieldArrayProps);

type Props = {
  fields: fields,
  typeOfField: string
};

const FieldMultipleTextInput = ({ fields, typeOfField }: Props) => (
  <div className={styles.container[`product${typeOfField.trim()}`]}>
    <FormLabel component="label">{typeOfField}:</FormLabel>
    {fields.map((fieldName, index) => (
      <div key={`${fieldName}_${index}`} className={styles.fieldContainer}>
        <Field
          name={`${fieldName}`}
          component={FieldTextInput}
          label={typeOfField}
          className={styles.field}
        />
        <IconButton arial-label="Cancel">
          <CancelIcon onClick={() => fields.splice(index, 1)} />
        </IconButton>
      </div>
    ))}
    <div>
      <Fab color="default" aria-label="Add" size="small">
        <AddIcon onClick={() => fields.push()} />
      </Fab>
    </div>
  </div>
);

export default FieldMultipleTextInput;
