import React from 'react';
import FormFieldSetContainer from '../FormFieldSet';
import formFieldSetContainerFieldConfigurationsByProductClass from './formFieldSetContainerFieldConfigurationsByProductClass';

type Props = {
  productClass: string
};

export const BatchInitializationFormFragmentInitialBatchState = ({
  productClass
}: Props) => {
  if (!productClass) {
    return null;
  }

  const formFieldSetContainerProps = {
    fields:
      formFieldSetContainerFieldConfigurationsByProductClass[productClass],
    legendText: 'Initial Batch State'
  };

  return <FormFieldSetContainer {...formFieldSetContainerProps} />;
};

BatchInitializationFormFragmentInitialBatchState.displayName =
  'BatchInitializationFormFragmentInitialBatchState';

export default BatchInitializationFormFragmentInitialBatchState;
