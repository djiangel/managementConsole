import React, { Component } from 'react';
import { Field } from 'redux-form';
import FormFieldSet from '../../components/FormFieldSet';
import FormInput from '../../components/FormInput';
import FormInputSelect from '../../components/FormInputSelect';
import { BATCH_INITIALIZATION_FORM } from '../../constants/formNames';
import BatchInitializationFormFragmentInitialBatchState from '../BatchInitializationFormFragmentInitialBatchState';
import FormContainer from '../Form';
import { StyledForm } from './StyledComponents';

type Props = {
  loading: boolean,
  onSubmit: (values: Object) => any,
  productOptions: Object[]
};

export default class BatchInitializationForm extends Component {
  props: Props;

  render() {
    const { loading, onSubmit, productOptions, ...rest } = this.props;

    return (
      <FormContainer
        {...rest}
        formName={BATCH_INITIALIZATION_FORM}
        render={({ handleSubmit }) => (
          <StyledForm onSubmit={handleSubmit}>
            <FormFieldSet
              legendText="Batch Details"
              renderInputs={({ inputClassName }) => [
                <Field
                  component={FormInput}
                  inputComponent={FormInputSelect}
                  className={inputClassName}
                  isLoading={loading}
                  key="productId"
                  labelText="Product"
                  name="productId"
                  options={productOptions}
                  placeholder="Product Name"
                />,
                <Field
                  component={FormInput}
                  className={inputClassName}
                  key="batchIdentifier"
                  labelText="Batch Identifier"
                  name="batchIdentifier"
                  placeholder="Batch Identifier"
                />
              ]}
            />
            <BatchInitializationFormFragmentInitialBatchState />
            <Field
              component={FormInput}
              key="notes"
              labelText="Notes"
              multiline
              name="notes"
              placeholder="Add notes..."
            />
          </StyledForm>
        )}
      />
    );
  }
}
