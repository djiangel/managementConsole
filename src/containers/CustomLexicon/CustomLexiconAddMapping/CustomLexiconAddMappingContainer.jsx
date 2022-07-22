import React, { Component, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import styles from './CustomLexiconAddMappingContainer.module.css';
import MaterialButton from '../../../components/MaterialButton';
import CancelIcon from '@material-ui/icons/Cancel';
import { Select, MenuItem, TextField } from '@material-ui/core';
import { Formik, Form, FieldArray, FieldProps, Field } from 'formik';
import { IconButton } from '../../../material/index';
import {
  capitalizeFirstLetter,
  splitCamelCase
} from '../CustomLexiconLanguageFormatter';

const CustomLexiconAddMappingContainer = ({
  flavor,
  lexes,
  languages,
  mapLexicons,
  closeMappingModal
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Formik
        initialValues={{ lexicons: [{ value: '', label: '', language: '' }] }}
        onSubmit={async values => {
          await mapLexicons(flavor, values.lexicons);
        }}
        render={({ values, handleChange, handleSubmit, errors }) => (
          <Form>
            <FieldArray
              validateOnChange={false}
              name="lexicons"
              render={({ push, remove }) => (
                <div className={styles.mainContainer}>
                  <div className={styles.buttonContainer}>
                    <MaterialButton
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        push({ value: '', label: '', language: '' })
                      }
                    >
                      +
                    </MaterialButton>
                  </div>
                  <div>
                    <div className={styles.subContainer}>
                      <div className={styles.fieldContainer}>
                        {t('customLexicon.selectLexicon')}
                      </div>
                      <div className={styles.fieldContainer}>
                        {t('customLexicon.selectLanguage')}
                      </div>
                      <div className={styles.fieldContainer}>
                        {t('customLexicon.value')}
                      </div>
                      <div>{t('customLexicon.action')}</div>
                    </div>
                    {values.lexicons.map((lexic, index) => {
                      return (
                        <div className={styles.subContainer} key={index}>
                          <div className={styles.fieldContainer}>
                            <Select
                              name={`lexicons[${index}].value`}
                              value={lexic.value}
                              placeholder="Choose Lexicon"
                              fullWidth
                              style={{
                                fontSize: '11px'
                              }}
                              onChange={handleChange}
                            >
                              {lexes &&
                                lexes.map(item => (
                                  <MenuItem
                                    style={{
                                      fontSize: '11px'
                                    }}
                                    key={item}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                            </Select>
                          </div>
                          <div className={styles.fieldContainer}>
                            <Select
                              name={`lexicons[${index}].language`}
                              value={lexic.language}
                              placeholder="Choose language"
                              fullWidth
                              style={{
                                fontSize: '11px'
                              }}
                              onChange={handleChange}
                            >
                              {languages &&
                                languages.map(item => (
                                  <MenuItem
                                    style={{
                                      fontSize: '11px'
                                    }}
                                    key={item}
                                    value={item}
                                  >
                                    {capitalizeFirstLetter(
                                      splitCamelCase(item)
                                    )}
                                  </MenuItem>
                                ))}
                            </Select>
                          </div>
                          <div className={styles.fieldContainer}>
                            <TextField
                              fullWidth
                              name={`lexicons[${index}].label`}
                              value={lexic.label}
                              onChange={handleChange}
                              inputProps={{ style: { fontSize: 11 } }}
                              InputLabelProps={{ style: { fontSize: 11 } }}
                            />
                          </div>
                          <div>
                            <IconButton
                              arial-label="Cancel"
                              onClick={() => {
                                remove(index);
                              }}
                              href=""
                            >
                              <CancelIcon />
                            </IconButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            />
            <div className={styles.footer}>
              <MaterialButton
                variant="outlined"
                soft
                onClick={closeMappingModal}
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
  );
};

export default withTranslation()(CustomLexiconAddMappingContainer);
