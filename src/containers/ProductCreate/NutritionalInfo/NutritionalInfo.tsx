import * as React from 'react';
import { FieldArray, Field, FormSection } from 'redux-form';
import { Card, CardHeader, CardContent, IconButton, Grid } from '../../../material/index';
import { chunk } from 'lodash';
import FieldTextInput from '../../../components/FieldTextInput';
import FormInput from '../../../components/FormInput';
import FormInputSelect from '../../../components/FormInputSelect';
import CancelIcon from '@material-ui/icons/Cancel';
import FormSectionHeader from '../../../components/FormSectionHeader';
import useStyles from './useStyles';
import MaterialButton from 'components/MaterialButton';
import { useTranslation } from 'react-i18next';
import { Token, Typeahead } from 'react-bootstrap-typeahead';

const styles = require('./NutritionalInfo.module.css');

const defaultNutritionalInfo: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.defaultInfoContainer}>
      {chunk(t('nutritionalInfo', { returnObjects: true }), 4).map(
        (fields, index) => (
          <div className={styles.fieldGroupContainer} key={index}>
            {fields.map((fieldName, index) => (
              <div
                key={`${fieldName}_${index}`}
                className={styles.fieldContainer}
              >
                <span className={styles.defaultInfoLabel}>
                  {fieldName.label}
                </span>
                <Grid container spacing={1}>
                  <Grid item xs={8} xl={10}>
                    <Field
                      name={fieldName.value}
                      component={FieldTextInput}
                      fullWidth
                      format={(value) => !isNaN(value) ? Math.round(Number(value)) : (value === undefined ? '' : value)}
                    />
                  </Grid>
                  <Grid item xs={4} xl={2}>
                    <Field
                      name={`${fieldName.value}_unit`}
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      key={`${fieldName.value}_unit`}
                      options={fieldName.unit}
                      hideSelectedOptions={false}
                      closeMenuOnSelect
                      placeholder={t('general.unit')}
                    />
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const additionalNutritionalInfo: React.FunctionComponent<any> = ({
  fields
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.additionalInfoContainer}>
      {fields.map((fieldName, index) => (
        <div
          key={`${fieldName}_${index}`}
          className={styles.additionalFieldContainer}
        >
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Field
                name={`${fieldName}.key`}
                className={styles.customFieldContainer}
                component={FieldTextInput}
                placeholder={t('general.property')}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Field
                name={`${fieldName}.value`}
                className={styles.customFieldContainer}
                component={FieldTextInput}
                placeholder={t('general.value')}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Field
                name={`${fieldName}.unit`}
                className={styles.customFieldContainer}
                component={FieldTextInput}
                placeholder={t('general.unit')}
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                arial-label="Cancel"
                onClick={() => fields.splice(index, 1)}
                href=""
              >
                <CancelIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      ))}
      <MaterialButton
        variant="contained"
        color="secondary"
        onClick={() => fields.push({ key: null, value: null })}
      >
        {`+ ${t('general.add')}`}
      </MaterialButton>
    </div>
  );
};

const NutritionalInfo: React.FunctionComponent = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <FormSectionHeader text={t('product.nutritionalInfo')} />
      <Card className={classes.root}>
        <CardHeader
          classes={{
            title: classes.cardTitle,
            subheader: classes.cardSubheader
          }}
          title={t('product.nutritionalInfo')}
        />
        <CardContent>
          <FormSection name="nutritionalInfo">
            <FieldArray name="default" component={defaultNutritionalInfo} />
            <FieldArray
              name="additional"
              component={additionalNutritionalInfo}
            />
          </FormSection>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionalInfo;
