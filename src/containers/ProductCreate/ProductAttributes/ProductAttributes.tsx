import * as React from 'react';
import { Field, FieldArray, FormSection } from 'redux-form';
import { IconButton } from '../../../material/index';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import RenderTextField from '../../../components/ProductClassAttributesInput/RenderTextField';
import RenderSwitch from '../../../components/ProductClassAttributesInput/RenderSwitch';
import FormSectionHeader from '../../../components/FormSectionHeader';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const styles = require('./ProductAttributes.module.css');

interface Props {
  fields: FieldArray;
}

const ProductAttributesText: React.FunctionComponent<Props> = ({ fields }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const { t } = useTranslation();

  return (
    <div className={styles.rowContainer}>
      <div className={styles.inputContainer}>
        <RenderTextField
          input={{ value: key, onChange: e => setKey(e.target.value) }}
          className={styles.field}
          label={t('general.property')}
        />
        <RenderTextField
          input={{ value: unit, onChange: e => setUnit(e.target.value) }}
          className={styles.field}
          label={t('general.unit')}
        />
        <RenderTextField
          input={{ value: value, onChange: e => setValue(e.target.value) }}
          className={styles.field}
          label={t('general.value')}
        />
        <MaterialButton
          variant="contained"
          color="secondary"
          onClick={() => {
            fields.push({ key: key, value: value, unit: unit });
            setKey('');
            setValue('');
            setUnit('');
          }}
          disabled={!key.length || !value.length || !unit.length}
        >
          {`+ ${t('general.add')}`}
        </MaterialButton>
      </div>
      {fields.map((fieldName, index) => (
        <div key={`${fieldName}_${index}`} className={styles.inputContainer}>
          <Field
            name={`${fieldName}.key`}
            className={styles.field}
            component={RenderTextField}
            label="Attribute Key"
          />
          <Field
            name={`${fieldName}.unit`}
            className={styles.field}
            component={RenderTextField}
            label="Attribute Unit"
          />
          <Field
            name={`${fieldName}.value`}
            className={styles.field}
            component={RenderTextField}
            label="Attribute Value"
          />
          <div style={{ flex: 1 }}>
            <IconButton
              arial-label="Cancel"
              onClick={() => fields.splice(index, 1)}
              href=""
            >
              <CancelIcon color="primary" fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};


const ProductAttributesBinary: React.FunctionComponent<Props> = ({
  fields
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('Yes');
  const { t } = useTranslation();

  return (
    <div className={styles.rowContainer}>
      <div className={styles.inputContainer}>
        <RenderTextField
          input={{ value: key, onChange: e => setKey(e.target.value) }}
          className={styles.field}
          label={t('general.property')}
        />
        <RenderSwitch
          input={{ value: value, onChange: e => {
            setValue(e.target.value)
          }
        }}
          className={styles.field}
        />
        <MaterialButton
          variant="contained"
          color="secondary"
          onClick={() => {
            fields.push({ key: key, value: value });
            setKey('');
            setValue('Yes');
          }}
          disabled={!key.length}
        >
          {`+ ${t('general.add')}`}
        </MaterialButton>
      </div>
      {fields.map((fieldName, index) => (
        <div key={`${fieldName}_${index}`} className={styles.inputContainer}>
          <Field
            name={`${fieldName}.key`}
            className={styles.field}
            component={RenderTextField}
            label="Attribute Key"
          />
          <Field
            name={`${fieldName}.value`}
            className={styles.field}
            component={RenderSwitch}
            label="Attribute Value"
          />
          <div style={{ flex: 1 }}>
            <IconButton
              arial-label="Cancel"
              onClick={() => fields.splice(index, 1)}
              href=""
            >
              <CancelIcon color="primary" fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductAttributes: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <FormSection name="productAttributes" style={{ flex: 1 }}>
        <FormSectionHeader text={t('product.textAttributes')} />
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <FieldArray name="text" component={ProductAttributesText} />
        </div>
        <FormSectionHeader text={t('product.binaryAttributes')} />
        <div style={{ display: 'flex' }}>
          <FieldArray name="binary" component={ProductAttributesBinary} />
        </div>
      </FormSection>
    </div>
  );
};

export default ProductAttributes;
