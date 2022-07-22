import React from 'react';

import { reduxForm } from 'redux-form';
import { PRODUCT_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import FormSectionProductConfiguration from './FormSectionProductConfiguration';

const validation = val => !val || (typeof val === 'object' && val.length === 0);
const validateBool = val => !(val === true || val === false);

export default reduxForm({
  form: PRODUCT_FORM,
  onSubmit: (values, dispatch) => {
    // console.log(values)
    dispatch(formSubmit(PRODUCT_FORM));
  },
  validate: values => {
    return {
      name: validation(values.name),
      brand: validation(values.brand),
      prototype: validateBool(values.prototype),
      productCategory: validation(values.productCategory),
      productFeature: validation(values.productFeature),
      productComponentBase: validation(values.productComponentBase),
      allergens: validation(values.allergens),
      physicalState: validation(values.physicalState),
      countryOfPurchase: validation(values.countryOfPurchase),
      country: validation(values.country)
    };
  },
  initialValues: {
    public: false,
    aroma: false,
    productFeature: [],
    productComponentBase: [],
    productComponentOther: [],
    productCategory: [],
    texture: true,
    prototype: false,
    questions: []
    // definedComponents: 'false',
    // definedComponentNames: null,
    // undefinedComponentTotal: { label: 1, value: 1 },
    // allowCustomTextureComponents: false
  }
})(FormSectionProductConfiguration);
