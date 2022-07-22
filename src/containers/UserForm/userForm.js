import React, { Component } from 'react';
import { Field } from 'redux-form';
import { toLower, trim } from 'lodash';
import FormFieldSet from '../../components/FormFieldSet';
import FormInput from '../../components/FormInput';
import FormInputSelect from '../../components/FormInputSelect';
import FormContainer from '../Form';
import normalizeDate from './normalizeDate';
import normalizePhoneNumber from './normalizePhoneNumber';
import { StyledForm } from './StyledComponents';

type Props = {
  ethnicityOptions: Object[],
  ethnicityOptionsLoading: boolean,
  formName: string,
  genderOptions: Object[],
  genderOptionsLoading: boolean,
  languageOptions: Object[],
  languageOptionsLoading: boolean,
  raceOptions: Object[],
  raceOptionsLoading: boolean,
  smokeOptions: Object[],
  smokeOptionsLoading: boolean,
  onSubmit: (values: Object) => any
};

export default class UserForm extends Component {
  props: Props;

  render() {
    const {
      ethnicityOptions,
      ethnicityOptionsLoading,
      formName,
      genderOptions,
      genderOptionsLoading,
      languageOptions,
      languageOptionsLoading,
      raceOptions,
      raceOptionsLoading,
      smokeOptions,
      smokeOptionsLoading,
      onSubmit,
      ...rest
    } = this.props;

    return (
      <FormContainer
        {...rest}
        formName={formName}
        render={({ handleSubmit }) => (
          <StyledForm onSubmit={handleSubmit}>
            <FormFieldSet
              legendText="Account Info"
              renderInputs={({ inputClassName }) => [
                <Field
                  component={FormInput}
                  className={inputClassName}
                  key="email"
                  labelText="Email"
                  name="email"
                  normalize={value => toLower(trim(value))}
                  placeholder="newuser@email.com"
                />,
                <Field
                  component={FormInput}
                  className={inputClassName}
                  key="phoneNumber"
                  labelText="Phone Number"
                  name="phoneNumber"
                  normalize={normalizePhoneNumber}
                  placeholder="+1 (555) 555-5555"
                />,
                <Field
                  component={FormInput}
                  className={inputClassName}
                  key="username"
                  labelText="Username"
                  name="username"
                  normalize={value => toLower(trim(value))}
                  placeholder="Username"
                />
              ]}
            />
            <FormFieldSet
              legendText="User Details"
              renderInputs={({ inputClassName }) => [
                <Field
                  component={FormInput}
                  className={inputClassName}
                  key="dateOfBirth"
                  labelText="Date Of Birth"
                  name="dateOfBirth"
                  normalize={normalizeDate}
                  placeholder="MM/DD/YYYY"
                />,
                <Field
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  className={inputClassName}
                  key="firstLanguage"
                  labelText="First Language"
                  loading={languageOptionsLoading}
                  name="firstLanguage"
                  options={languageOptions}
                  placeholder="First Language"
                />,
                <Field
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  className={inputClassName}
                  key="ethnicity"
                  labelText="Ethnicity"
                  loading={ethnicityOptionsLoading}
                  name="ethnicity"
                  options={ethnicityOptions}
                  placeholder="Ethnicity"
                />,
                <Field
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  className={inputClassName}
                  key="race"
                  labelText="Race"
                  loading={raceOptionsLoading}
                  name="race"
                  options={raceOptions}
                  placeholder="Race"
                />,
                <Field
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  className={inputClassName}
                  key="smoke"
                  labelText="Smoke"
                  loading={smokeOptionsLoading}
                  name="smoke"
                  options={smokeOptions}
                  placeholder="Smoke"
                />
              ]}
            />
          </StyledForm>
        )}
      />
    );
  }
}
