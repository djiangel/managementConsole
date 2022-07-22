import React from 'react';
import { Field } from 'redux-form';
import FormFieldSet from '../../components/FormFieldSet';
import FieldTextInput from '../../components/FieldTextInput';
import Panel from '../../components/Panel';
import { AUTHENTICATION_FORM } from '../../constants/formNames';
import FormContainer from '../Form';
import syncValidate from './syncValidate';
import { StyledContainerDiv, StyledPanelFooter } from './StyledComponents';
import MaterialButton from '../../components/MaterialButton';

const AuthenticationContainer = () => (
  <StyledContainerDiv>
    <FormContainer
      formConfiguration={{ validate: syncValidate }}
      formName={AUTHENTICATION_FORM}
      render={({ handleSubmit, invalid, submitting }) => (
        <Panel className="welcomePanel">
          <div className="header">
            <span>Welcome to Gastrograph</span>
          </div>
          <form className="authenticationForm" onSubmit={handleSubmit}>
            {submitting && <p>Signing In...</p>}
            <FormFieldSet
              renderInputs={({ inputClassName }) => [
                <Field
                  component={FieldTextInput}
                  className={inputClassName}
                  fullWidth
                  margin="none"
                  variant="outlined"
                  key="email"
                  label="Email"
                  name="email"
                  placeholder="you@example.com"
                  style={{ marginBottom: 20 }}
                />,
                <Field
                  component={FieldTextInput}
                  className={inputClassName}
                  fullWidth
                  variant="outlined"
                  margin="none"
                  key="password"
                  label="Password"
                  name="password"
                  placeholder="Password"
                  type="password"
                />
              ]}
            />
            <StyledPanelFooter className="panelFooter">
              <MaterialButton
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={invalid}
                type="submit"
              >
                Sign In
              </MaterialButton>
            </StyledPanelFooter>
          </form>
        </Panel>
      )}
    />
  </StyledContainerDiv>
);

AuthenticationContainer.displayName = 'AuthenticationContainer';

export default AuthenticationContainer;
