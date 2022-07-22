import React from 'react';

import FormInputSelect from '../FormInputSelect';
import { useTranslation } from 'react-i18next';

export default function RenderDropdownCreatable(props) {
  const { input, ...rest } = props;
  const { t } = useTranslation();

  return (
    <FormInputSelect
      creatable
      isClearable
      {...input}
      {...rest}
      placeholder={t('forms.selectCreate')}
    />
  );
}
