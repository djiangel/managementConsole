import * as React from 'react';

import { useTranslation } from 'react-i18next';

const styles = require('./ProductCard.module.css');

interface Props {
  nutritionalInfo?: any;
}

const RenderNutritionalInfo: React.FunctionComponent<Props> = ({
  nutritionalInfo
}) => {
  const { t } = useTranslation();
  let array = [];

  if (nutritionalInfo) {
    let nutritionalInfoCopy = Object.assign({}, nutritionalInfo);
    let additionalInfoArray;

    if (nutritionalInfoCopy.hasOwnProperty('additional')) {
      const additionalInfo = nutritionalInfo.additional;

      additionalInfoArray = additionalInfo.map(
        info => `${info.key}: ${info.value}`
      );
      delete nutritionalInfoCopy.additional;
    }

    for (const key in nutritionalInfoCopy) {
      if (nutritionalInfoCopy.hasOwnProperty(key)) {
        const translatedAttribute = Array<any>(
          t('nutritionalInfo', {
            returnObjects: true
          })
        ).find(attribute => attribute.value === key);

        array.push(
          `${translatedAttribute ? translatedAttribute.label : key}: ${
            nutritionalInfo[key]
          }`
        );
      }
    }

    array.concat(additionalInfoArray);
  }

  return (
    <div className={styles.productPropertyTableContainer}>
      {!array.length ? (
        t('general.noData')
      ) : (
        <div>
          {array.map((element, index) => (
            <div key={`${element}_${index}`}>{element}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderNutritionalInfo;
