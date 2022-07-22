import React, { Component } from 'react';
import styles from './MergeAccountContainer.module.css';
import FieldTextInput from '../../components/FieldTextInput';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { withTranslation } from 'react-i18next';

export class MergeAccountContainer extends Component {
  render() {
    const { handleSubmit, submitting, pristine, invalid, t } = this.props;

    return (
      <div>
        <div className={styles.sectionContainer}>
          <Field
            name="oldEmail"
            component={FieldTextInput}
            fullWidth
            label={'Old Email'}
            required
          />
          <Field
            name="newEmail"
            component={FieldTextInput}
            fullWidth
            label={'New Email'}
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

export default withTranslation()(MergeAccountContainer);
