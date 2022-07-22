import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import FormInput from '../../../components/FormInput';
import styles from '../RequestReport.module.css';
import FormInputSelect from '../../../components/FormInputSelect';
import FieldTextInput from '../../../components/FieldTextInput';
import FieldCheckBox from '../../../components/FieldCheckBox';

export default function ReportType({ type, producerId }) {
  const { t } = useTranslation();
  return (
    <div>
      <h5 className={styles.productHeader}>{t('navigation.reports')}</h5>
      <h3 className={styles.productFieldsTitle}>
        {t('reports.createReportRequest')}
      </h3>

      <div className={styles.sectionContainer}>
        <Field
          name="projectName"
          component={FieldTextInput}
          fullWidth
          label={t('reports.projectName')}
          required
        />
      </div>
      <div className={styles.sectionContainer}>
        <Field
          name="targetGroup"
          component={FieldTextInput}
          fullWidth
          label={t('reports.targetGroup')}
          required
        />
      </div>
      <div className={styles.sectionContainer}>
        <Field
          name="client"
          component={FieldTextInput}
          fullWidth
          label={t('reports.client')}
          required
        />
      </div>
      <div className={styles.sectionContainer}>
        <Field
          name="type"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="type"
          customLabel
          labelText={t('reports.reportTypeLabel')}
          options={t('reportType', { returnObjects: true })}
          isSearchable
          isClearable
          hideSelectedOptions={false}
          placeholder={t('reports.reportTypePlaceholder')}
          closeMenuOnSelect={true}
          required
        />
      </div>
      {/* {type &&
        (type.value == 'Market Survey' || type.value == 'Product') && (
          <div className={styles.sectionContainer}>
            <Field
              name="includeTexture"
              component={FieldCheckBox}
              label={t('reviews.texture')}
              required
              optionLabel={t('reports.includeTexture')}
            />
          </div>
        )} */}
      {(producerId == 25 || producerId == 209) &&
        type &&
        type.value == 'Optimization' && (
          <div className={styles.sectionContainer}>
            <Field
              name="testMode"
              component={FieldCheckBox}
              label={t('reviews.testMode')}
              required
              optionLabel={t('reports.testMode')}
            />
          </div>
        )}
    </div>
  );
}
