import * as React from 'react';
import { Field, FormSection } from 'redux-form';
import { INPUT_TYPE } from '../../../constants/productClassAttributes';
import { chunk } from 'lodash';
import RenderDatePicker from '../../../components/ProductClassAttributesInput/RenderDatePicker';
import RenderTimePicker from '../../../components/ProductClassAttributesInput/RenderTimePicker';
import RenderDropdown from '../../../components/ProductClassAttributesInput/RenderDropdown';
import RenderDropdownCreatable from '../../../components/ProductClassAttributesInput/RenderDropdownCreatable';
import RenderTextField from '../../../components/ProductClassAttributesInput/RenderTextField';
import RenderNullField from '../../../components/ProductClassAttributesInput/RenderNullField';
import RenderTextFieldSuffix from '../../../components/ProductClassAttributesInput/RenderTextFieldSuffix';
import RenderSwitch from '../../../components/ProductClassAttributesInput/RenderSwitch';
import RenderRadioButtonCreatable from 'components/ProductClassAttributesInput/RenderRadioButtonCreatable';
import { useTranslation } from 'react-i18next';

const styles = require('./RenderProductClassAttributes.module.css');

interface Props {
  productClass: string;
  currentProductClassAttributes: any[];
}

const containsTextArea = (array) => {
  return !!array.find((attribute) => attribute.type === INPUT_TYPE.TEXT_AREA_INPUT)
}

const isNumber = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

const RenderProductClassAttributes: React.FunctionComponent<Props> = ({
  productClass,
  currentProductClassAttributes
}) => {
  const { t } = useTranslation();
  return (
    <FormSection name={`productClassAttribute.${productClass}`}>
      {currentProductClassAttributes &&
        chunk(currentProductClassAttributes, 2).map((fields, index) => (
          <div className={!containsTextArea(fields) ? styles.container : undefined}  
          key={index}>
            {fields.map((attribute, index) => {
              return (
                <div
                  key={`${attribute.label}_${index}`}
                  className={styles.formContainer}
                >
                  {!attribute.placeholder && (
                    <div className={styles.label}>
                      {t(
                        `productClassAttributesLabels.${productClass}.${
                          attribute.label
                        }`
                      )}
                    </div>
                  )}
                  <div className={styles.fields}>
                    {(() => {
                      switch (attribute.type) {
                        case INPUT_TYPE.DATE_PICKER:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderDatePicker}
                              fullWidth
                            />
                          );

                        case INPUT_TYPE.TIME_PICKER:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderTimePicker}
                            />
                          );

                        case INPUT_TYPE.DROPDOWN:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderDropdown}
                              options={t(
                                `productClassAttributes.${productClass}.${
                                  attribute.key
                                }`,
                                { returnObjects: true }
                              )}
                            />
                          );

                        case INPUT_TYPE.DROPDOWN_CREATABLE:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderDropdownCreatable}
                              options={t(
                                `productClassAttributes.${productClass}.${
                                  attribute.key
                                }`,
                                { returnObjects: true }
                              )}
                            />
                          );

                        case INPUT_TYPE.TEXT_INPUT:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderTextField}
                              placeholder={
                                attribute.placeholder &&
                                t(
                                  `productClassAttributesLabels.${productClass}.${
                                    attribute.placeholder
                                  }`
                                )
                              }
                            />
                          );

                          case INPUT_TYPE.NULL_INPUT:
                            return (
                              <Field
                                component={RenderNullField}
                              />
                            );

                        case INPUT_TYPE.TEXT_INPUT_SUFFIX:
                          return (
                            <FormSection name={attribute.label}>
                              <RenderTextFieldSuffix
                                options={attribute.values}
                              />
                            </FormSection>
                          );

                        case INPUT_TYPE.SWITCH:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderSwitch}
                            />
                          );

                        case INPUT_TYPE.NUMBER_INPUT:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderTextField}
                              validate={isNumber}
                            />
                          );
                        case INPUT_TYPE.NUMBER_INPUT_SUFFIX:
                          return (
                            <FormSection name={attribute.label}>
                              <RenderTextFieldSuffix
                                options={attribute.values}
                                validate={isNumber}
                              />
                            </FormSection>
                          );

                        case INPUT_TYPE.TEXT_AREA_INPUT:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderTextField}
                              options={attribute.values}
                              multiline
                              variant="outlined"
                              rows="4"
                            />
                          );

                        case INPUT_TYPE.RADIO_BUTTON_CREATABLE:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderRadioButtonCreatable}
                              options={t(
                                `productClassAttributes.${productClass}.${
                                  attribute.key
                                }`,
                                { returnObjects: true }
                              )}
                            />
                          );

                        case INPUT_TYPE.DROPDOWN_MULTI:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderDropdown}
                              options={t(
                                `productClassAttributes.${productClass}.${
                                  attribute.key
                                }`,
                                { returnObjects: true }
                              )}
                              isMulti
                              closeMenuOnSelect={false}
                            />
                          );

                        case INPUT_TYPE.DROPDOWN_MULTI_CREATABLE:
                          return (
                            <Field
                              name={attribute.label}
                              component={RenderDropdownCreatable}
                              options={t(
                                `productClassAttributes.${productClass}.${
                                  attribute.key
                                }`,
                                { returnObjects: true }
                              )}
                              isMulti
                              closeMenuOnSelect={false}
                            />
                          );

                        default:
                          return `ERROR!: INPUT TYPE NOT FOUND`;
                      }
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </FormSection>
  );
};

export default RenderProductClassAttributes;
