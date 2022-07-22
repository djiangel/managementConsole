import React, { Component } from 'react';
import styles from './ChangePasswordContainer.module.css';
import FieldTextInput from '../../components/FieldTextInput';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { withTranslation } from 'react-i18next';
import FormInputSelect from '../../components/FormInputSelect';
import FormInput from '../../components/FormInput';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

export class ChangePasswordContainer extends Component {
  inputOptions = [
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' }
  ];

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      invalid,
      t,
      identifier
    } = this.props;

    return (
      <div>
        <div className={styles.sectionContainer}>
          <Field
            name="identifier"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="identifier"
            customLabel
            labelText={'Identifier'}
            options={this.inputOptions}
            hideSelectedOptions={false}
            placeholder={'Select Identifier'}
            closeMenuOnSelect={true}
          />
          {identifier &&
            identifier.value === 'username' && (
              <Field
                name="username"
                component={FieldTextInput}
                fullWidth
                label={t('users.username')}
                required
              />
            )}
          {identifier &&
            identifier.value === 'email' && (
              <Field
                name="email"
                component={FieldTextInput}
                fullWidth
                label={t('users.email')}
                required
              />
            )}
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

const mapStateToProps = state => {
  // console.log(state.form.CHANGE_PASSWORD_FORM);
  return {
    identifier:
      state.form.CHANGE_PASSWORD_FORM.values &&
      state.form.CHANGE_PASSWORD_FORM.values.identifier
  };
};

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(ChangePasswordContainer);
