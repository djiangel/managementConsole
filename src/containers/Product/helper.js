import {
  INPUT_TYPE,
  PRODUCT_CLASS_ATTRIBUTES
} from '../../constants/productClassAttributes';
import { COUNTRIES } from '../../constants/country';
import i18next from 'i18next';
import { startsWith } from 'lodash';

/**
 * Returns url of the main image of a product. If no image is available, a placeholder image will be returned
 * @param productImages an array of images for a product
 * @returns {string} url of the main product image or the image placeholder
 */
export function getMainImageUrl(productImages) {
  return productImages && productImages[0].url;
}

/**
 * Converts country code to the country name
 * @param countryCode that represents a country
 * @returns {string} country name
 */
export const getCountryText = countryCode => {
  const country = COUNTRIES.find(country => country.code === countryCode);

  return `${country.emoji} ${i18next.t(`country.${country.code}`)}`;
};

/**
 * Restructures the product class attributes object fetched from database to match the format required by the form
 * @param defaultAttributes {object} product class attributes fetched from database
 * @return {object} formatted product class attributes to be passed into the form
 */
export function formattedDefaultAttributes(defaultAttributes) {
  let formattedObject = {};

  for (const productClass in defaultAttributes) {
    formattedObject[productClass] = {};

    for (const attribute in defaultAttributes[productClass]) {
      const selectedAttribute =
        PRODUCT_CLASS_ATTRIBUTES[productClass] &&
        PRODUCT_CLASS_ATTRIBUTES[productClass].find(
          possibleAttribute => possibleAttribute.label === attribute
        );
      const attributeType = selectedAttribute && selectedAttribute.type;
      const key = selectedAttribute && selectedAttribute.key;

      switch (attributeType) {
        case INPUT_TYPE.TEXT_INPUT:
        case INPUT_TYPE.NUMBER_INPUT:
        case INPUT_TYPE.SWITCH:
        case INPUT_TYPE.TIME_PICKER:
        case INPUT_TYPE.DATE_PICKER:
        case INPUT_TYPE.RADIO_BUTTON_CREATABLE:
          formattedObject[productClass][attribute] =
            defaultAttributes[productClass][attribute];
          break;

        case INPUT_TYPE.NUMBER_INPUT_SUFFIX:
        case INPUT_TYPE.TEXT_INPUT_SUFFIX:
          formattedObject[productClass][attribute] = {
            unit: {
              label: defaultAttributes[productClass][attribute].unit,
              value: defaultAttributes[productClass][attribute].unit
            },
            value: defaultAttributes[productClass][attribute].value
          };
          break;

        case INPUT_TYPE.DROPDOWN:
        case INPUT_TYPE.DROPDOWN_CREATABLE:
          formattedObject[productClass][attribute] = {
            label: i18next
              .t(`productClassAttributes.${productClass}.${key}`, {
                returnObjects: true
              })
              .find(
                selectedValue =>
                  selectedValue.value ===
                  defaultAttributes[productClass][attribute]
              ).label,
            value: defaultAttributes[productClass][attribute]
          };
          break;

        case INPUT_TYPE.DROPDOWN_MULTI:
        case INPUT_TYPE.DROPDOWN_MULTI_CREATABLE:
          formattedObject[productClass][attribute] = defaultAttributes[
            productClass
          ][attribute].map(attribute => ({
            label: i18next
              .t(`productClassAttributes.${productClass}.${key}`, {
                returnObjects: true
              })
              .find(selectedValue => selectedValue.value === attribute).label,
            value: attribute
          }));
          break;

        default:
        // we ignore attribute with no translation available as it is probably
        // an erroneous attribute
      }
    }
  }
  return formattedObject;
}

/**
 * Formats a string to match the input structure of react-select i.e. `{label: string, value: string}`
 * @param string
 * @param type
 * @return {{input: *, label: string, value: string}|{label: *, value: *}}
 */
export function formattedStringSelection(string, type) {
  const OTHER = 'Others';
  const OTHER_TOKENIZER = ':';
  const options = i18next.t(`${type}`, { returnObjects: true });

  if (string.includes(OTHER)) {
    return {
      label: options.find(option => option.value === OTHER).label,
      value: OTHER,
      input: string
        .split(OTHER_TOKENIZER)
        .pop()
        .trim()
    };
  }
  return {
    label: options.find(option => option.value === string).label,
    value: string
  };
}

export function getSelectedAllergen(string) {
  // const containsOptions = i18next.t('allergenInfo.contains', {
  //   returnObjects: true
  // });
  // const safeOptions = i18next.t('allergenInfo.safe', { returnObjects: true });

  const options = i18next.t('allergenInfo.contains', {
    returnObjects: true
  });

  const selectedOption = options.find(
    option => option.value === toTitleCase(string)
  );

  return (
    selectedOption && {
      label: selectedOption.label,
      value: toTitleCase(string)
    }
  );
}

export function getSelectedCertifiedSafe(string) {
  // const containsOptions = i18next.t('allergenInfo.contains', {
  //   returnObjects: true
  // });
  // const safeOptions = i18next.t('allergenInfo.safe', { returnObjects: true });

  const options = i18next.t('allergenInfo.safe', { returnObjects: true });

  const selectedOption = options.find(
    option => option.value === toTitleCase(string)
  );

  return (
    selectedOption && {
      label: selectedOption.label,
      value: toTitleCase(string)
    }
  );
}

export function getSelectedPhysicalState(string) {
  const options = i18next.t('physicalState', { returnObjects: true });

  if (startsWith(string, 'Others: ')) string = 'Others';

  const selectedOption = options.find(
    option => option.value === toTitleCase(string)
  );

  return (
    selectedOption && {
      label: selectedOption.label,
      value: toTitleCase(string)
    }
  );
}

export function getOthersPhysicalState(states) {
  const splitStates = states.split(',');
  for (var state of splitStates) {
    if (startsWith(state, 'Others: ')) {
      return { input: state.slice(8) };
    }
  }
  return null;
}

/**
 * Checks if an object is nested object or simple object
 * Used to support old product class attributes, which are simple objects
 * @param object
 * @returns {boolean}
 */
export function isNestedObject(object) {
  if (object) {
    for (const key in object) {
      if (typeof object[key] === 'object') return true;
    }
  }
  return false;
}

/**
 * Transform old product class attributes to the new product attributes
 * @param object
 * @returns {{unit: string, value: *, key: string}[]}
 */
export function toNewProductAttribute(object) {
  if (object) {
    return {
      text: Object.keys(object).map(key => ({
        key,
        value: object[key],
        unit: ''
      }))
    };
  }
  return null;
}

/**
 * Converts a string to title case
 * @param str
 * @returns {*}
 */
export function toTitleCase(str) {
  if (!str) {
    return str;
  }
  return str.replace(/\b[\w']+\b/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
