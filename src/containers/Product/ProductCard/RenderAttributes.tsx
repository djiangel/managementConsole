import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  INPUT_TYPE,
  PRODUCT_CLASS_ATTRIBUTES
} from '../../../constants/productClassAttributes';

const styles = require('./ProductCard.module.css');

interface Props {
  properties: object;
  productClass?: any;
  defaultAttributes?: object;
}

const RenderClassAttributeProperties: React.FunctionComponent<Props> = ({
  productClass,
  properties
}) => {
  const { t } = useTranslation();
  const propertiesArray = [];

  for (const key in properties) {
    const label = t(`productClassAttributesLabels.${productClass}.${key}`);
    const input = PRODUCT_CLASS_ATTRIBUTES[productClass] && PRODUCT_CLASS_ATTRIBUTES[productClass].find(
      attribute => attribute.label === key
    );

    if (properties.hasOwnProperty(key)) {
      if (
        properties[key].hasOwnProperty('value') &&
        properties[key].hasOwnProperty('unit')
      ) {
        propertiesArray.push(
          `${label}: ${properties[key].value} ${properties[key].unit}`
        );
      } else {
        switch (input && input.type) {
          case INPUT_TYPE.DROPDOWN:
          case INPUT_TYPE.DROPDOWN_CREATABLE:
          case INPUT_TYPE.DROPDOWN_MULTI_CREATABLE:
          case INPUT_TYPE.DROPDOWN_MULTI:
            // Obtain the key that points to the correct attribute in
            // productClassAttributes.productClass
            const translationKey = PRODUCT_CLASS_ATTRIBUTES[productClass].find(
              attribute => attribute.label === key
            ).key;

            // Obtain the translated text (if exist) else uses default text
            const value = Array<any>(
              t(`productClassAttributes.${productClass}.${translationKey}`, {
                returnObjects: true
              })
            ).find(selectedValue => selectedValue.value === properties[key]);

            propertiesArray.push(
              `${label}: ${value ? value.label : properties[key]}`
            );
            break;

          case INPUT_TYPE.SWITCH:
            const selectedValue = `${properties[key]}`.toLowerCase();
            propertiesArray.push(`${label}: ${t(`forms.${selectedValue}`)}`);
            break;

          default:
            // handles the case when there is no translation available for the key
            // use original key value
            propertiesArray.push(`${key}: ${properties[key]}`);
        }
      }
    }
  }

  return (
    <div>
      {propertiesArray.map(property => (
        <div key={`${property}`}>{property}</div>
      ))}
    </div>
  );
};

const RenderProductAttributeProperties = ({ properties }) => {
  const textProperties = properties.hasOwnProperty('text')
    ? properties['text']
    : null;
  const binaryProperties = properties.hasOwnProperty('binary')
    ? properties['binary']
    : null;

  return (
    <div>
      {textProperties &&
        textProperties.map((property, index) => (
          <div key={`${property.key}_${index}`}>{`${property.key}: ${
            property.value
          } ${property.unit}`}</div>
        ))}
      {binaryProperties &&
        binaryProperties.map((property, index) => (
          <div key={`${property.key}_${index}`}>{`${property.key}: ${
            property.value
          }`}</div>
        ))}
    </div>
  );
};

const RenderAttributes = ({ defaultAttributes, productAttributes }) => {
  const defaultAttributesArray = defaultAttributes
    ? Object.entries(defaultAttributes)
    : null;

  const { t } = useTranslation();

  return (
    <div>
      {defaultAttributesArray &&
        defaultAttributesArray.map((attribute, index) => (
          <div
            key={`${attribute}_${index}`}
            className={styles.productPropertyTableContainer}
          >
            {attribute[0]} {t('product.properties')}:
            <RenderClassAttributeProperties
              productClass={attribute[0]}
              properties={attribute[1]}
            />
          </div>
        ))}
      {productAttributes ? (
        <div className={styles.productPropertyTableContainer}>
          {t('product.productProperties')}
          <RenderProductAttributeProperties properties={productAttributes} />
        </div>
      ) : null}
    </div>
  );
};

export default RenderAttributes;
