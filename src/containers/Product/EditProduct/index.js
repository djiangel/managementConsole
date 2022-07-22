import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { upperFirst } from 'lodash';
import { EDIT_PRODUCT_FORM } from '../../../constants/formNames';
import formSubmit from '../../../actions/formSubmit';
import EditProductForm from './EditProductForm';
import {
  getCountryText,
  formattedDefaultAttributes,
  formattedStringSelection,
  getSelectedAllergen,
  getSelectedCertifiedSafe,
  getSelectedPhysicalState,
  getOthersPhysicalState
} from '../helper';
import i18next from 'i18next';

const validation = val => !val || (typeof val === 'object' && val.length === 0);
const validateBool = val => !(val === true || val === false);

const allergenList = Array(
  i18next.t('allergenInfo.contains', {
    returnObjects: true
  })
)[0];

const certifiedSafeList = Array(
  i18next.t('allergenInfo.safe', {
    returnObjects: true
  })
)[0];

const mapStateToProps = (state, props) => ({
  initialValues: {
    id: props.id,
    name: props.name,
    localName: props.localName && props.localName,
    brand: props.brand,
    aroma: props.aroma,
    ingredients: props.ingredients,
    public: props.public,
    images: { toBeAdded: [], toBeRemoved: [] },
    nutritionalInfoImages: { toBeAdded: [], toBeRemoved: [] },
    productAttributes: props.productAttributes,
    productClassAttribute:
      props.defaultAttributes &&
      formattedDefaultAttributes(props.defaultAttributes),
    nutritionalInfo: props.nutritionalInfo,
    productCategory: props.productCategory
      ? [
          getFormattedTagObject(
            props.productCategory.name,
            props.productCategory.id
          )
        ]
      : [],
    productCategoryBefore: props.productCategory
      ? [
          getFormattedTagObject(
            props.productCategory.name,
            props.productCategory.id
          )
        ]
      : [],
    productFeature:
      props.productFeatures &&
      props.productFeatures.map(({ productFeatureByProductFeatureId }) =>
        getFormattedTagObject(
          productFeatureByProductFeatureId.name,
          productFeatureByProductFeatureId.id
        )
      ),
    productFeatureBefore:
      props.productFeatures &&
      props.productFeatures.map(({ id, productFeatureByProductFeatureId }) => ({
        ...getFormattedTagObject(
          productFeatureByProductFeatureId.name,
          productFeatureByProductFeatureId.id
        ),
        productFeatureProductId: id
      })),
    productComponentBase:
      props.productComponentBases &&
      props.productComponentBases.map(
        ({ productComponentBaseByProductComponentBaseId }) =>
          getFormattedTagObject(
            productComponentBaseByProductComponentBaseId.name,
            productComponentBaseByProductComponentBaseId.id
          )
      ),
    productComponentBaseBefore:
      props.productComponentBases &&
      props.productComponentBases.map(
        ({ id, productComponentBaseByProductComponentBaseId }) => ({
          ...getFormattedTagObject(
            productComponentBaseByProductComponentBaseId.name,
            productComponentBaseByProductComponentBaseId.id
          ),
          productComponentBaseProductId: id
        })
      ),
    productComponentOther:
      props.productComponentOthers &&
      props.productComponentOthers.map(
        ({ productComponentOtherByProductComponentOtherId }) =>
          getFormattedTagObject(
            productComponentOtherByProductComponentOtherId.name,
            productComponentOtherByProductComponentOtherId.id
          )
      ),
    productComponentOtherBefore:
      props.productComponentOthers &&
      props.productComponentOthers.map(
        ({ id, productComponentOtherByProductComponentOtherId }) => ({
          ...getFormattedTagObject(
            productComponentOtherByProductComponentOtherId.name,
            productComponentOtherByProductComponentOtherId.id
          ),
          productComponentOtherProductId: id
        })
      ),
    allergens:
      props.dietaryRestrictions &&
      props.dietaryRestrictions
        .split(',')
        .filter(allergen =>
          allergenList.find(value => value.value === allergen)
        )
        .map(allergen => getSelectedAllergen(allergen)),
    certifiedSafe:
      props.dietaryRestrictions &&
      props.dietaryRestrictions
        .split(',')
        .filter(allergen =>
          certifiedSafeList.find(value => value.value === allergen)
        )
        .map(allergen => getSelectedCertifiedSafe(allergen)),
    servingVessel:
      props.servingVessel &&
      formattedStringSelection(props.servingVessel, 'servingVessel'),
    physicalState:
      props.physicalState &&
      props.physicalState
        .split(',')
        .map(state => getSelectedPhysicalState(state)),
    custom_physicalState:
      props.physicalState && getOthersPhysicalState(props.physicalState),
    country: props.country && {
      label: getCountryText(props.country),
      value: props.country
    },
    countryOfPurchase: props.countryOfPurchase && {
      label: getCountryText(props.countryOfPurchase),
      value: props.countryOfPurchase
    },
    texture: props.hasTextureComponents,
    definedComponents:
      props.textureComponents && props.textureComponents.defined
        ? 'true'
        : 'false',
    definedComponentNames:
      props.textureComponents &&
      props.textureComponents.defined &&
      props.textureComponents.label
        ? {
            component: props.textureComponents.label.map(name => ({
              key: null,
              value: name
            }))
          }
        : null,
    undefinedComponentTotal:
      props.textureComponents &&
      !props.textureComponents.defined &&
      props.textureComponents.label
        ? {
            label: props.textureComponents.label.length,
            value: props.textureComponents.label.length
          }
        : { label: 1, value: 1 },
    allowCustomTextureComponents: props.allowCustomTextureComponents,
    prototype: props.prototype,
    folder: props.folder,
    selectedProductQuestions: props.selectedProductQuestions.nodes,
    questions: props.selectedProductQuestions
      ? props.selectedProductQuestions.nodes.map(node => node.question.id)
      : []
  }
});

/**
 * Returns the desired format for tag options
 * @param label name of the tag option
 * @param id identifier of the tag option
 * @returns {{label: *, id: string}}
 */
function getFormattedTagObject(label, id) {
  return {
    label: upperFirst(label),
    id: id.toString()
  };
}

export default connect(mapStateToProps)(
  reduxForm({
    form: EDIT_PRODUCT_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(EDIT_PRODUCT_FORM));
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
    enableReinitialize: true
  })(EditProductForm)
);
