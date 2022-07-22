import React, { Component } from 'react';
import styles from './UserCreateContainer.module.css';
import FieldTextInput from '../../components/FieldTextInput';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { withTranslation } from 'react-i18next';

export class UserCreateContainer extends Component {
  render() {
    const { handleSubmit, submitting, pristine, invalid, t } = this.props;

    return (
      <div>
        <div className={styles.sectionContainer}>
          <Field
            name="username"
            component={FieldTextInput}
            fullWidth
            label={t('users.username')}
            required
          />
          <Field
            name="email"
            component={FieldTextInput}
            fullWidth
            label={t('users.email')}
          />
          <Field
            name="password"
            component={FieldTextInput}
            fullWidth
            label={t('users.password')}
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <MaterialButton
            variant="outlined"
            disabled={pristine || invalid || submitting}
            onClick={handleSubmit}
            soft
            teal
          >
            Submit
          </MaterialButton>
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserCreateContainer);
