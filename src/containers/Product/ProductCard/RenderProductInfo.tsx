import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toTitleCase } from '../helper';

const styles = require('./ProductCard.module.css');

interface Props {
  property: string;
  value: string;
}

const RenderProductInfo: React.FunctionComponent<Props> = ({
  property,
  value
}) => {
  const { t } = useTranslation();

  // Identify if the product info is for dietary restriction
  // Special case for dietary restriction since its values are stored within 2 arrays
  if (property === 'allergenInfo' || property === 'physicalState') {
    const options = property === 'allergenInfo' ? Array<any>(
      t('allergenInfo.contains', {
        returnObjects: true
      })
    )[0].concat(t('allergenInfo.safe', { returnObjects: true }))
    : t('physicalState', { returnObjects: true });
    const arrayifiedValues = value && value.split(',');
    const translatedValues =
      arrayifiedValues &&
      arrayifiedValues.map(selectedValue => {
        const value = options.find(
          value => value.value === toTitleCase(selectedValue)
        );
        return value && value.label;
      });

    return (
      <div className={styles.productPropertyContainer}>
        {translatedValues
          ? translatedValues.join(', ')
          : t('general.notSelected')}
      </div>
    );
  } else {
    // If 'Other' is being selected as an option
    if (value && value.includes('Others: ')) {
      return (
        <div className={styles.productPropertyContainer}>
          {value.replace('Others: ', '')}
        </div>
      );
    }

    const translatedValue = Array<any>(
      t(`${property}`, { returnObjects: true })
    )[0].find(selectedValue => selectedValue.value === value);
    return (
      <div className={styles.productPropertyContainer}>
        {translatedValue ? translatedValue.label : t('general.notSelected')}
      </div>
    );
  }
};

export default RenderProductInfo;
