import * as React from 'react';
import { getCountryText } from '../helper';
import { useTranslation } from 'react-i18next';

const styles = require('./ProductCard.module.css');

interface Props {
  countryCode?: string;
}

const RenderProductCountry: React.FunctionComponent<Props> = ({
  countryCode
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.productPropertyContainer}>
      {countryCode ? getCountryText(countryCode) : t('general.notSelected')}
    </div>
  );
};

export default RenderProductCountry;
