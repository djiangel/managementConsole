import * as React from 'react';

import { useTranslation } from 'react-i18next';

const styles = require('./ProductCard.module.css');

interface Props {
  property?: string;
}

const RenderProductText: React.FunctionComponent<Props> = ({
  property
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.productPropertyContainer}>
      {property ? property : t('general.notSelected')}
    </div>
  );
};

export default RenderProductText;
