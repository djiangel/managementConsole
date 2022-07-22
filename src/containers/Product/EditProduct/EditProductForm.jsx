import React, { Component } from 'react';
import { Field, FieldArray, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { compose, graphql } from 'react-apollo';
import {
  Stepper,
  StepButton,
  StepLabel,
  Step,
  Paper,
  Grid,
  IconButton
} from '../../../material/index';
import CancelIcon from '@material-ui/icons/Cancel';
import MaterialButton from '../../../components/MaterialButton';
import { ALL_ALLERGENS } from '../../../constants/attributes';
import selectWorkspaceProducerId from '../../../selectors/workspaceProducerId';
import FieldBinaryRadio from '../../../components/FieldBinaryRadio';
import FieldTextInput from '../../../components/FieldTextInput';
import FieldFolderSelect from '../../../components/FieldFolderSelect';
import FormInput from '../../../components/FormInput';
import FormInputSelect from '../../../components/FormInputSelect';
import FormInputRadio from '../../../components/FormInputRadio';
import FieldCheckBox from '../../../components/FieldCheckBox';
import ProductCategory from '../../ProductCreate/ProductCategory';
import ProductFeature from '../../ProductCreate/ProductFeature';
import ProductComponentBase from '../../ProductCreate/ProductComponentBase';
import ProductComponentOther from '../../ProductCreate/ProductComponentOther';
import ProductAttributes from '../../ProductCreate/ProductAttributes';
import ProductImageUpload from '../../ProductCreate/ProductImageUpload';
import NutritionalInfo from '../../ProductCreate/NutritionalInfo';
import ProductClassAttributes from '../../ProductCreate/ProductClassAttributes';
import QuestionSelection from '../../ProductCreate/QuestionSelection';
import FoldersQuery from '../../../graphql/queries/FoldersQuery';
import AllProductCategoriesQuery from '../../../graphql/queries/AllProductCategoriesQuery';
import AllProductFeaturesQuery from '../../../graphql/queries/AllProductFeaturesQuery';
import AllProductComponentBasesQuery from '../../../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../../../graphql/queries/AllProductComponentOthersQuery';
import AllQuestionQuery from '../../../graphql/queries/AllQuestionQuery';
import ProducerByIdQuery from '../../../graphql/queries/ProducerByIdQuery';
import styles from './EditProductForm.module.css';
import { withTranslation } from 'react-i18next';
import { toTitleCase } from '../helper';
import FormSectionHeader from '../../../components/FormSectionHeader';
import { COUNTRIES } from '../../../constants/country';
import StepperIcon from '../../../components/StepperIcon';
import { pick } from 'lodash';
import RenderProductClassAttributes from '../../ProductCreate/ProductClassAttributes/RenderProductClassAttributes';
import { PRODUCT_CLASS_ATTRIBUTES } from '../../../constants/productClassAttributes';
import InvalidModal from '../../../components/InvalidModal';
import { CAT_EDIT_PRODUCT } from '../../../constants/googleAnalytics/categories';
import { event } from 'react-ga';
import {
  EDIT_PRODUCT,
  EDIT_PRODUCT_DISCARD,
  EDIT_PRODUCT_INCOMPLETE,
  EDIT_PRODUCT_MOVE_STEP,
  EDIT_PRODUCT_NEXT,
  EDIT_PRODUCT_PREV
} from '../../../constants/googleAnalytics/actions';
import { EP_STEP_LABELS } from '../../../constants/googleAnalytics/labels';

const dateFormat = 'MMM dd, yyyy';
class EditProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productCategory: props.productCategory && props.productCategory.name,
      isLiquid: props.physicalState === 'Liquid',
      openAllergen: null,
      activeStep: 0,
      showInvalidModal: false
    };
  }

  // Handler for breadcrumb
  handleBackStep = () => {
    event({
      category: CAT_EDIT_PRODUCT,
      action: EDIT_PRODUCT_PREV,
      label: EP_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleNextStep = () => {
    event({
      category: CAT_EDIT_PRODUCT,
      action: EDIT_PRODUCT_NEXT,
      label: EP_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    this.props.invalid
      ? this.handleInvalidFields()
      : this.setState({
          activeStep: this.state.activeStep + 1
        });
  };

  handleStep = step => () => {
    event({
      category: CAT_EDIT_PRODUCT,
      action: EDIT_PRODUCT_MOVE_STEP,
      // The step the button is clicked - target step
      label: `${EP_STEP_LABELS[this.state.activeStep]} - ${
        EP_STEP_LABELS[step]
      }`
    });

    this.props.invalid
      ? this.handleInvalidFields()
      : this.setState({
          activeStep: step
        });
  };

  handleEdit = () => {
    event({
      category: CAT_EDIT_PRODUCT,
      action: EDIT_PRODUCT,
      label: EP_STEP_LABELS[this.state.activeStep]
    });

    if (this.props.invalid) {
      this.handleInvalidFields();
    } else {
      this.props.handleSubmit();
      this.props.toggleEdit();
    }
  };

  handleInvalidFields = () => {
    this.setState({ showInvalidModal: true }, () =>
      event({
        category: CAT_EDIT_PRODUCT,
        action: EDIT_PRODUCT_INCOMPLETE,
        label: this.props.invalidFields.join(',')
      })
    );
  };

  setProductCategory = productCategory => {
    this.setState({
      productCategory
    });
  };

  setIsLiquid = isLiquid => {
    this.setState({
      isLiquid
    });
  };

  onMenuClose = () => {
    this.setState({
      openAllergen: false
    });
  };

  onMenuOpen = () => {
    this.setState({
      openAllergen: true
    });
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.hasAllergens && this.props.hasAllergens) {
      this.setState({
        openAllergen: true
      });
    }
  }

  definedComponentNamesField = ({ fields }) => {
    const { t } = this.props;

    return (
      <div className={styles.additionalInfoContainer}>
        {fields.map((fieldName, index) => (
          <div
            key={`${fieldName}_${index}`}
            className={styles.additionalFieldContainer}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <span className={styles.definedContainerName}>
                  {t('product.component') + `${index + 1}`}
                </span>
              </Grid>
              <Grid item>
                <Field
                  name={`${fieldName}.value`}
                  className={styles.definedContainer}
                  component={FieldTextInput}
                  placeholder={t('product.componentName') + `${index + 1}`}
                  fullWidth
                  margin="none"
                />
              </Grid>
              <Grid item>
                <IconButton
                  arial-label="Cancel"
                  onClick={() => fields.splice(index, 1)}
                  href=""
                >
                  <CancelIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        ))}
        {fields.length < 5 && (
          <MaterialButton
            variant="contained"
            color="secondary"
            onClick={() => fields.push({ key: null, value: null })}
          >
            {`+ ${t('general.add')}`}
          </MaterialButton>
        )}
      </div>
    );
  };

  render() {
    const {
      handleSubmit,
      pristine,
      invalid,
      submitting,
      toggleEdit,
      toggleDelete,
      productImages,
      nutritionalInfoImages,
      categories,
      component_bases,
      component_others,
      features,
      questions,
      producer,
      t,
      hasAllergens,
      hasNoAllergens,
      invalidFields,
      hasTexture,
      definedComponents,
      createdAt,
      updatedAt,
      name
    } = this.props;
    const {
      productCategory,
      isLiquid,
      openAllergen,
      results,
      activeStep,
      loadingData,
      showInvalidModal
    } = this.state;
    const STEPS = t('product.createProductSteps', {
      returnObjects: true
    }).slice(
      0,
      producer.producer && producer.producer.allowBehavioralQuestions ? 4 : 3
    );

    // Allergen Options
    // TODO: Refactor allergen info in new version of the console
    const ALLERGEN = [
      {
        label: t('product.contains'),
        options: t('allergenInfo.contains', { returnObjects: true })
      }
    ];
    const NO_ALLERGEN = [
      {
        label: t('product.contains'),
        options: t('allergenInfo.contains', { returnObjects: true }).slice(0, 1)
      }
    ];

    const SOME_ALLERGEN = [
      {
        label: t('product.contains'),
        options: t('allergenInfo.contains', { returnObjects: true }).slice(
          1,
          10
        )
      }
    ];

    const CERTIFIED_SAFE = t('allergenInfo.safe', { returnObjects: true });

    return (
      <Paper className={styles.formContainer}>
        <h3 className={styles.productFieldsTitle}>
          {t('product.editProductHeader')}
        </h3>
        <br />
        <br />
        <h5 className={styles.productTitle}>{name}</h5>
        <div className={styles.dateContainer}>
          {t('general.dateCreated')}{' '}
          {formatDate(parseISO(createdAt), dateFormat)}
        </div>
        <div className={styles.dateContainer}>
          {t('general.dateUpdated')}{' '}
          {formatDate(parseISO(updatedAt), dateFormat)}
        </div>

        <Stepper activeStep={activeStep} nonLinear alternativeLabel>
          {STEPS.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={this.handleStep(index)}>
                <StepLabel StepIconComponent={StepperIcon}>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <div>
            <div className={styles.sectionContainer}>
              <Field
                name="prototype"
                component={FieldBinaryRadio}
                key="prototype"
                label={t('product.productOption')}
                optionLabel={t('product.prototype')}
                required
                parse={value => (value === 'Yes' ? true : false)}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
            </div>

            <Field
              name="public"
              component={FieldBinaryRadio}
              key="public"
              optionLabel={t('product.public')}
              helperText={t('product.publicHelpText')}
              // label={t('product.productSecurity')}
              parse={value => (value === 'Yes' ? true : false)}
              format={value => (value ? 'Yes' : value === false ? 'No' : '')}
            />

            <Field
              name="aroma"
              component={FieldBinaryRadio}
              key="aroma"
              optionLabel={t('product.aroma')}
              helperText={t('product.aromaHelpText')}
              parse={value => (value === 'Yes' ? true : false)}
              format={value => (value ? 'Yes' : value === false ? 'No' : '')}
            />

            <div className={styles.sectionContainer}>
              <FormSectionHeader text={t('product.productInfo')} />
              <Field
                name="name"
                component={FieldTextInput}
                fullWidth
                label={t('product.productName')}
                required
              />
              <Field
                name="localName"
                component={FieldTextInput}
                fullWidth
                label={t('product.productLocalName')}
              />
              <Field
                name="brand"
                component={FieldTextInput}
                fullWidth
                label={t('product.productBrand')}
                required
              />
            </div>

            <div className={styles.sectionContainer}>
              <NutritionalInfo />
            </div>

            <div className={styles.sectionContainer}>
              <FormSectionHeader text={t('product.ingredients')} />
              <Field
                name="ingredients"
                component={FieldTextInput}
                fullWidth
                placeholder={t('product.ingredientsPlaceholder')}
              />
            </div>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className={styles.sectionContainer}>
                  <Field
                    name="allergens"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    autoFocus={openAllergen !== null}
                    key={
                      hasAllergens
                        ? 'SOME_ALLERGEN'
                        : hasNoAllergens
                          ? 'NO_ALLERGEN'
                          : 'ALLERGEN'
                    }
                    customLabel
                    labelText={t('product.allergenInfo')}
                    options={
                      hasAllergens
                        ? SOME_ALLERGEN
                        : hasNoAllergens
                          ? NO_ALLERGEN
                          : ALLERGEN
                    }
                    isSearchable
                    isClearable
                    isMulti
                    creatable
                    hideSelectedOptions={false}
                    placeholder={t('product.dietaryRestrictionsPlaceholder')}
                    closeMenuOnSelect={false}
                    checkbox
                    menuIsOpen={openAllergen}
                    onMenuClose={this.onMenuClose}
                    onMenuOpen={this.onMenuOpen}
                    onChange={value =>
                      value[0] &&
                      value[0].value == 'No Allergens' &&
                      this.onMenuClose()
                    }
                    required
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={styles.sectionContainer}>
                  <Field
                    name="certifiedSafe"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    key="certifiedSafe"
                    customLabel
                    labelText={t('product.certifiedSafe')}
                    options={CERTIFIED_SAFE}
                    isSearchable
                    isClearable
                    isMulti
                    creatable
                    hideSelectedOptions={false}
                    placeholder={t('product.certifiedSafePlaceholder')}
                    closeMenuOnSelect={false}
                    checkbox
                  />
                </div>
              </Grid>
            </Grid>

            <div className={styles.sectionContainer}>
              <RenderProductClassAttributes
                productClass="Batch"
                currentProductClassAttributes={
                  pick(PRODUCT_CLASS_ATTRIBUTES, ['Batch'])['Batch']
                }
              />
            </div>

            <div className={styles.sectionContainer}>
              <Field
                name="physicalState"
                component={FormInput}
                inputComponent={FormInputSelect}
                key="physicalState"
                customLabel
                labelText={t('product.physicalState')}
                options={t('physicalState', { returnObjects: true })}
                isSearchable
                isClearable
                hideSelectedOptions={false}
                placeholder={t('product.physicalStatePlaceholder')}
                closeMenuOnSelect={true}
                onChange={(_, newValue) => {
                  if (newValue.find(val => val.label === 'Liquid')) {
                    this.setIsLiquid(true);
                  } else {
                    this.setIsLiquid(false);
                  }
                }}
                required
                isMulti
                checkbox
              />
            </div>

            <div className={styles.sectionContainer}>
              <ProductCategory
                data={categories}
                setProductCategory={this.setProductCategory}
              />
            </div>

            <div className={styles.sectionContainer}>
              <ProductComponentBase data={component_bases} />
            </div>

            <div className={styles.sectionContainer}>
              <ProductComponentOther data={component_others} />
            </div>

            <div className={styles.sectionContainer}>
              <ProductFeature data={features} />
            </div>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className={styles.sectionContainer}>
                  <Field
                    name="country"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    key="country"
                    labelText={t('product.countryOfOrigin')}
                    options={COUNTRIES.map(country => ({
                      label: `${country.emoji} ${t(`country.${country.code}`)}`,
                      value: country.code
                    }))}
                    isSearchable
                    isClearable
                    placeholder={t('product.countryPlaceholder')}
                    customLabel
                    required
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={styles.sectionContainer}>
                  <Field
                    name="countryOfPurchase"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    key="countryOfPurchase"
                    labelText={t('product.countryOfPurchase')}
                    options={COUNTRIES.map(country => ({
                      label: `${country.emoji} ${t(`country.${country.code}`)}`,
                      value: country.code
                    }))}
                    isSearchable
                    isClearable
                    placeholder={t('product.countryPlaceholder')}
                    customLabel
                    required
                  />
                </div>
              </Grid>
            </Grid>

            {/* <Field
              name="texture"
              component={FieldCheckBox}
              key="texture"
              optionLabel={t('product.texture')}
            />

            {hasTexture && (
              <Field
                name="definedComponents"
                component={FormInputRadio}
                key="definedComponents"
                options={t('product.textureComponentOptions', {
                  returnObjects: true
                })}
                onChange={() => {
                  this.props.change('undefinedComponentTotal', {
                    label: 1,
                    value: 1
                  });
                  this.props.change('definedComponentNames', null);
                }}
              />
            )}

            {hasTexture &&
              definedComponents === 'true' && (
                <FormSection name="definedComponentNames">
                  <FieldArray
                    name="component"
                    component={this.definedComponentNamesField}
                  />
                </FormSection>
              )}

            {hasTexture &&
              definedComponents === 'false' && (
                <React.Fragment>
                  <div className={styles.undefinedContainer}>
                    <Field
                      name={'undefinedComponentTotal'}
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      key={'undefinedComponentTotal'}
                      options={Array.from({ length: 5 }, (v, k) => k + 1)}
                      hideSelectedOptions={false}
                      closeMenuOnSelect
                      placeholder={t('product.undefinedComponentTotal')}
                    />
                    <Field
                      name="allowCustomTextureComponents"
                      component={FieldCheckBox}
                      key="allowCustomTextureComponents"
                      optionLabel={t('product.allowCustomTextureComponents')}
                    />
                  </div>
                </React.Fragment>
              )} */}
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <div className={styles.productClassAttributes}>
              <FormSectionHeader text={t('product.productClassAttribute')} />
              <div>
                <ProductClassAttributes productClass="General" />
                {toTitleCase(productCategory) === 'General' ||
                toTitleCase(productCategory) === 'Liquid' ? null : (
                  <ProductClassAttributes
                    key={`${productCategory}`}
                    productClass={toTitleCase(productCategory)}
                  />
                )}
                {isLiquid ? (
                  <ProductClassAttributes productClass="Liquid" />
                ) : null}
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <ProductAttributes />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <div className={styles.sectionContainer}>
              <FormSectionHeader text={t('product.productImage')} />
              <ProductImageUpload name="images" defaultImages={productImages} />
            </div>

            <div className={styles.sectionContainer}>
              <FormSectionHeader text={t('product.nutritionalInfoImage')} />
              <ProductImageUpload
                name="nutritionalInfoImages"
                defaultImages={nutritionalInfoImages}
              />
            </div>

            <Field
              name="folder"
              component={FieldFolderSelect}
              key="folder"
              label="Folder"
              folderResults={this.props.folderResults}
            />
          </div>
        )}

        {activeStep === 3 && (
          <Field
            component={QuestionSelection}
            name="questions"
            data={questions}
          />
        )}

        <InvalidModal
          open={showInvalidModal}
          handleClose={() => this.setState({ showInvalidModal: false })}
          invalid={invalid}
          invalidFields={invalidFields}
        />

        <div className={styles.buttonContainer}>
          {activeStep > 0 && (
            <MaterialButton
              onClick={this.handleBackStep}
              variant="outlined"
              soft
            >
              Back
            </MaterialButton>
          )}
          {activeStep < STEPS.length - 1 && (
            <MaterialButton
              onClick={this.handleNextStep}
              variant="outlined"
              soft
            >
              Next
            </MaterialButton>
          )}

          <MaterialButton
            color="secondary"
            variant="outlined"
            onClick={toggleDelete}
            soft
          >
            Delete Product
          </MaterialButton>

          <MaterialButton
            disabled={pristine || submitting}
            onClick={this.handleEdit}
            variant="outlined"
            soft
            teal
          >
            Confirm Changes
          </MaterialButton>

          <MaterialButton
            variant="outlined"
            onClick={() => {
              event({
                category: CAT_EDIT_PRODUCT,
                action: EDIT_PRODUCT_DISCARD
              });
              toggleEdit();
            }}
            soft
          >
            Discard Changes
          </MaterialButton>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  const values = state.form.EDIT_PRODUCT_FORM.values;
  const name = values.name;
  const brand = values.brand;
  const allergens = values.allergens;
  const physicalState = values.physicalState;
  const productCategory = values.productCategory;
  const productFeature = values.productFeature;
  const productComponentBase = values.productComponentBase;
  const countryOfPurchase = values.countryOfPurchase;
  const country = values.country;
  const prototype = values.prototype;
  const hasTexture = values.texture;
  const definedComponents = values.definedComponents;
  const requiredFields = {
    name,
    brand,
    allergens,
    physicalState,
    productCategory,
    productFeature,
    productComponentBase,
    countryOfPurchase,
    country,
    prototype
  };

  const invalidFields = Object.keys(requiredFields).filter(
    field =>
      (Array.isArray(requiredFields[field]) && !requiredFields[field].length) ||
      requiredFields[field] === '' ||
      requiredFields[field] === null
  );

  const allergenList = state.form.EDIT_PRODUCT_FORM.values.allergens;
  const hasNoAllergens =
    (allergenList &&
      allergenList.length > 0 &&
      allergenList.findIndex(a => a.label === 'No Allergens') > -1) ||
    false;
  const hasAllergens =
    allergenList &&
    allergenList.length > 0 &&
    allergenList.findIndex(a => ALL_ALLERGENS.indexOf(a.label) > -1) > -1;

  return {
    producerId: selectWorkspaceProducerId(state),
    hasAllergens,
    hasNoAllergens,
    invalidFields,
    hasTexture,
    definedComponents
  };
};

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  graphql(ProducerByIdQuery, {
    name: 'producer',
    options: props => ({
      variables: {
        id: props.producerId
      }
    })
  }),
  graphql(AllProductFeaturesQuery, {
    options: props => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'features'
  }),
  graphql(AllProductCategoriesQuery, {
    options: props => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'categories'
  }),
  graphql(AllProductComponentBasesQuery, {
    options: props => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'component_bases'
  }),
  graphql(AllProductComponentOthersQuery, {
    options: props => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'component_others'
  }),
  graphql(FoldersQuery, {
    options: props => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'folderResults'
  }),
  graphql(AllQuestionQuery, {
    name: 'questions'
  })
)(EditProductForm);
