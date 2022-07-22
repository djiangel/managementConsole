import React, { Component } from 'react';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FieldTextInput from '../../components/FieldTextInput';
import styles from './DeviceCreate.module.css';
import { withTranslation } from 'react-i18next';

class DeviceCreateContainer extends Component {
  render() {
    const { pristine, invalid, submitting, handleSubmit, t } = this.props;

    return (
      <div className={styles.deviceCreate}>
        <Paper className={styles.paperContainer}>
          <h1>{t('device.registerDevice')}</h1>
          <div className={styles.formContainer}>
            <Field
              name="deviceName"
              component={FieldTextInput}
              label={t('device.deviceName')}
            />
            <Field
              name="deviceUid"
              component={FieldTextInput}
              label={t('device.deviceUid')}
              required
            />
            <Button
              style={{ marginTop: 30 }}
              color="primary"
              variant="contained"
              size="large"
              disabled={pristine || invalid || submitting}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withTranslation()(DeviceCreateContainer);
