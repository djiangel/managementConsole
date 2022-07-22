import * as React from 'react';
import { Field } from 'redux-form';
import FormInput from '../../../components/FormInput';
import FormInputSelect from '../../../components/FormInputSelect';
import { useTranslation } from 'react-i18next';

interface Props {
  data?: any;
}

const AddPanel: React.FunctionComponent<Props> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Field
      name="addToPanel"
      component={FormInput}
      inputComponent={FormInputSelect}
      key="addToPanel"
      labelText={t('product.addToPanel')}
      options={
        data.producer &&
        data.producer.panels &&
        data.producer.panels.nodes.map(({ id, pin }) => ({
          label: pin,
          value: id
        }))
      }
      isSearchable
      isClearable
      isMulti
      placeholder={t('product.addToPanelPlaceholder')}
      customLabel
    />
  );
};

export default AddPanel