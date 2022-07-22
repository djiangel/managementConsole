import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CustomLexiconCreateContainer.module.css';
import MaterialButton from '../../../components/MaterialButton';
import { withTranslation } from 'react-i18next';
import { Formik, Form, FieldArray, FieldProps, Field } from 'formik';
import { Select, MenuItem, TextField, InputLabel } from '@material-ui/core';
import {
  capitalizeFirstLetter,
  splitCamelCase
} from '../CustomLexiconLanguageFormatter';

const CustomLexiconCreateContainer = ({
  flavor,
  languages,
  createCustomLexicon,
  closeCreateModal
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.sectionContainer}>
        <Formik
          initialValues={{
            flavorAttribute: flavor,
            value: '',
            label: '',
            language: ''
          }}
          validate={values => {
            const errors = {};
            if (!values.language.length) {
              errors.language = 'Language cannot be empty.';
            }
            if (!values.value.length) {
              errors.value = 'Value cannot be empty.';
            }
            if (!values.label.length) {
              errors.label = 'Label cannot be empty.';
            }
            return errors;
          }}
          onSubmit={async values => {
            const { flavorAttribute, value, label, language } = values;
            await createCustomLexicon(flavorAttribute, value, label, language);
          }}
          render={({ values, handleChange, handleSubmit, errors }) => (
            <Form>
              <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                  <div className={styles.header}>{flavor}</div>
                  <div className={styles.fieldContainer}>
                    <InputLabel>{t('customLexicon.language')}</InputLabel>
                    <Select
                      label="Language"
                      name="language"
                      value={values.language}
                      placeholder="Choose language"
                      fullWidth
                      style={{
                        paddingTop: '5px'
                      }}
                      onChange={handleChange}
                    >
                      {languages &&
                        languages.map(item => (
                          <MenuItem key={item} value={item}>
                            {capitalizeFirstLetter(splitCamelCase(item))}
                          </MenuItem>
                        ))}
                    </Select>
                    <span className={styles.error}>
                      {errors && errors.language}
                    </span>
                  </div>
                  <div className={styles.fieldContainer}>
                    <InputLabel>{t('customLexicon.value')}</InputLabel>
                    <TextField
                      fullWidth
                      name="value"
                      value={values.value}
                      onChange={handleChange}
                    />
                    <span className={styles.error}>
                      {errors && errors.value}
                    </span>
                  </div>
                  <div className={styles.fieldContainer}>
                    <InputLabel>{t('customLexicon.label')}</InputLabel>
                    <TextField
                      fullWidth
                      name="label"
                      value={values.label}
                      onChange={handleChange}
                    />
                    <span className={styles.error}>
                      {errors && errors.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.footer}>
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={closeCreateModal}
                >
                  {'Cancel'}
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  soft
                  teal
                  onClick={handleSubmit}
                >
                  {'Save'}
                </MaterialButton>
              </div>
            </Form>
          )}
        />
      </div>
    </div>
  );
};

export default withTranslation()(CustomLexiconCreateContainer);
