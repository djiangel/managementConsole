import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Field, FieldArray, FormSection } from 'redux-form';
import {
  Paper,
  OutlinedInput,
  InputAdornment,
  Stepper,
  StepLabel,
  StepButton,
  Step,
  IconButton,
  Grid
} from '../../material/index';
import { Search as SearchIcon } from '@material-ui/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import { pick, capitalize } from 'lodash';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import AllProductCategoriesQuery from '../../graphql/queries/AllProductCategoriesQuery';
import AllProductFeaturesQuery from '../../graphql/queries/AllProductFeaturesQuery';
import AllProductComponentBasesQuery from '../../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../../graphql/queries/AllProductComponentOthersQuery';
import AvailablePanelQuery from '../../graphql/queries/AvailablePanels';
import AllQuestionQuery from '../../graphql/queries/AllQuestionQuery';
import ProducerByIdQuery from '../../graphql/queries/ProducerByIdQuery';
import FieldTextInput from '../../components/FieldTextInput';
import FormInput from '../../components/FormInput';
import FormInputSelect from '../../components/FormInputSelect';
import FieldBinaryRadio from '../../components/FieldBinaryRadio';
import FormInputRadio from '../../components/FormInputRadio';
import FieldCheckBox from '../../components/FieldCheckBox';
import AddPanel from './AddPanel';
import ProductFeature from './ProductFeature';
import ProductCategory from './ProductCategory';
import ProductComponentBase from './ProductComponentBase';
import ProductComponentOther from './ProductComponentOther';
import NutritionalInfo from './NutritionalInfo';
import ProductClassAttributes from './ProductClassAttributes';
import ProductAttributes from './ProductAttributes';
import ProductImageUpload from './ProductImageUpload';
import QuestionSelection from './QuestionSelection';
import { ALL_ALLERGENS } from '../../constants/attributes';
import styles from './FormSectionProductConfiguration.module.css';
import { withTranslation } from 'react-i18next';
import FormSectionHeader from '../../components/FormSectionHeader';
import LoadingScreen from '../../components/LoadingScreen';
import MaterialButton from '../../components/MaterialButton';
import { toTitleCase } from '../Product/helper';
import { COUNTRIES } from '../../constants/country';
import { createCORSRequest } from '../../utils/corsRequest';
import USDAProductSearch from '../../components/USDAProductSearch';
import ConfirmationModal from './ConfirmationModal';
import InvalidModal from '../../components/InvalidModal';
import {
  USDA_SEARCH_URI,
  USDA_NUTRIENTS_URI,
  LABEL_NUTRIENTS,
  LABEL_NUTRIENTS_USDA_MAPPING,
  SERVING_SIZE,
  SERVING_SIZE_UNIT,
  INGREDIENTS,
  NAME,
  BRAND
} from '../../constants/usdaApi.js';
import StepperIcon from '../../components/StepperIcon';
import RenderProductClassAttributes from './ProductClassAttributes/RenderProductClassAttributes';
import { PRODUCT_CLASS_ATTRIBUTES } from '../../constants/productClassAttributes';
import { event } from 'react-ga';
import { CAT_CREATE_PRODUCT } from '../../constants/googleAnalytics/categories';
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_INCOMPLETE,
  CREATE_PRODUCT_NEXT,
  CREATE_PRODUCT_PREV,
  CREATE_PRODUCT_MOVE_STEP
} from '../../constants/googleAnalytics/actions';
import { CP_STEP_LABELS } from '../../constants/googleAnalytics/labels';

class FormSectionProductConfiguration extends Component {
  state = {
    productCategory: '',
    isLiquid: false,
    openAllergen: null,
    search: '',
    submitSearch: false,
    activeStep: 0,
    loadingData: false,
    showConfirmationModal: false,
    showInvalidModal: false
  };

  // Handler for breadcrumb
  handleBackStep = () => {
    event({
      category: CAT_CREATE_PRODUCT,
      action: CREATE_PRODUCT_PREV,
      label: CP_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    this.setState({
      activeStep: this.state.activeStep - 1
    });
  };

  handleNextStep = () => {
    event({
      category: CAT_CREATE_PRODUCT,
      action: CREATE_PRODUCT_NEXT,
      label: CP_STEP_LABELS[this.state.activeStep] // The step the button is clicked
    });

    this.props.invalid || this.props.pristine
      ? this.handleInvalidFields()
      : this.setState({
          activeStep: this.state.activeStep + 1
        });
  };

  handleStep = step => () => {
    event({
      category: CAT_CREATE_PRODUCT,
      action: CREATE_PRODUCT_MOVE_STEP,
      // The step the button is clicked - target step
      label: `${CP_STEP_LABELS[this.state.activeStep]} - ${
        CP_STEP_LABELS[step]
      }`
    });

    this.props.invalid || this.props.pristine
      ? this.handleInvalidFields()
      : this.setState({
          activeStep: step
        });
  };

  handleCreate = () => {
    event({
      category: CAT_CREATE_PRODUCT,
      action: CREATE_PRODUCT,
      label: CP_STEP_LABELS[this.state.activeStep]
    });

    this.props.invalid ? this.handleInvalidFields() : this.props.handleSubmit();
  };

  handleInvalidFields = () => {
    this.setState({ showInvalidModal: true }, () =>
      event({
        category: CAT_CREATE_PRODUCT,
        action: CREATE_PRODUCT_INCOMPLETE,
        label: this.props.invalidFields.join(',')
      })
    );
  };

  // Submit USDA search when user press enter
  keyPress = e => {
    if (e.keyCode == 13) {
      this.sendEdamamReq();
    }
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

  componentWillUpdate(nextProps, nextState) {
    if (nextState.search === '' && this.state.submitSearch) {
      this.setState({ submitSearch: false });
    }
  }

  sendEdamamReq = () => {
    this.setState({
      submitSearch: true
    });

    let query = this.state.search.replace(/\s/g, '+');

    const API_KEY = 'UMZ5idOVfjk2aJpuGhex0y0dahJsGGXSDMPKLuJL';

    const url = `${USDA_SEARCH_URI}api_key=${API_KEY}&generalSearchInput=${query}&includeDataTypeList=Branded`;

    const xhr = createCORSRequest('GET', url);

    const that = this;

    // Response handlers.
    xhr.onload = function() {
      // console.log(xhr.responseText);
      that.changeResult(JSON.parse(xhr.responseText));
      that.setState({ loadingData: false });
    };

    xhr.onerror = function() {
      console.log('Error!!!');
      that.setState({ loadingData: false });
    };

    xhr.onloadstart = function() {
      // console.log('HERE');
      that.setState({ loadingData: true });
    };

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  };

  changeResult = value => {
    this.setState({
      results: value
    });
  };

  sendEdamamReqProd = id => {
    const url =
      USDA_NUTRIENTS_URI +
      id +
      '?api_key=UMZ5idOVfjk2aJpuGhex0y0dahJsGGXSDMPKLuJL';

    const xhr = createCORSRequest('GET', url);

    this.setState({ submitSearch: false });

    const that = this;

    // Response handlers.
    xhr.onload = function() {
      console.log(xhr.responseText);
      // Load data
      const resp = JSON.parse(xhr.responseText);

      // Name and brand
      that.props.change('name', resp[NAME]);
      that.props.change('brand', resp[BRAND]);

      // Serving Size
      that.props.change('nutritionalInfo.Serving size', resp[SERVING_SIZE]);
      that.props.change('nutritionalInfo.Serving size_unit', {
        label: resp[SERVING_SIZE_UNIT],
        value: resp[SERVING_SIZE_UNIT]
      });

      // Nutritional Info
      LABEL_NUTRIENTS_USDA_MAPPING.map(nutrient => {
        if (resp[LABEL_NUTRIENTS][nutrient.usda]) {
          that.props.change(
            'nutritionalInfo.' + nutrient.field,
            resp[LABEL_NUTRIENTS][nutrient.usda].value
          );
          console.log(nutrient.unit);
          that.props.change('nutritionalInfo.' + nutrient.field + '_unit', {
            label: nutrient.unit,
            value: nutrient.unit
          });
        }
      });

      // Ingredients
      let capitalizedIngredients = resp[INGREDIENTS].split(' ')
        .map(
          item =>
            /[^a-zA-Z0-9]/.test(item.charAt(0))
              ? item.charAt(0) + capitalize(item.slice(1))
              : capitalize(item)
        )
        .join(' ');
      that.props.change('ingredients', capitalizedIngredients);

      that.setState({ showConfirmationModal: true });
    };

    xhr.onerror = function() {
      console.log('Error!!!');
    };

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  };

  handleCancelLoadUsda = () => {
    const { change } = this.props;
    this.setState({ showConfirmationModal: false });
    // Name and brand
    change('name', '');
    change('brand', '');

    // Serving Size
    change('nutritionalInfo.Serving size', '');
    change('nutritionalInfo.Serving size_unit', '');

    // Nutritional Info
    LABEL_NUTRIENTS_USDA_MAPPING.map(nutrient => {
      change('nutritionalInfo.' + nutrient.field, '');
      change('nutritionalInfo.' + nutrient.field + '_unit', '');
    });

    // Ingredients
    change('ingredients', '');
  };

  changeResult = value => {
    this.setState({
      results: value
    });
  };

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
                  required
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
      pristine,
      invalid,
      submitting,
      features,
      component_bases,
      component_others,
      categories,
      panels,
      questions,
      producer,
      t,
      isPrototype,
      hasAllergens,
      hasNoAllergens,
      invalidFields,
      hasTexture,
      definedComponents
    } = this.props;

    const {
      productCategory,
      isLiquid,
      openAllergen,
      results,
      activeStep,
      loadingData,
      showConfirmationModal,
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

    if (
      categories.loading ||
      features.loading ||
      component_bases.loading ||
      component_others.loading
    ) {
      return <LoadingScreen />;
    }

    if (producer.loading && panels.loading) {
      return <LoadingScreen />;
    }

    if (panels.error) {
      return `ERROR: Unable to fetch data!`;
    }

    return (
      <Paper className={styles.container}>
        <h5 className={styles.productHeader}>{t('navigation.products')}</h5>
        <h3 className={styles.productFieldsTitle}>
          {t('product.createProductHeader')}
        </h3>

        <ConfirmationModal
          open={showConfirmationModal}
          handleConfirm={() => this.setState({ showConfirmationModal: false })}
          handleCancel={this.handleCancelLoadUsda}
        />

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
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
            </div>

            <Field
              name="public"
              component={FieldBinaryRadio}
              key="public"
              optionLabel={t('product.public')}
              helperText={t('product.publicHelpText')}
              parse={value => value === 'Yes'}
              format={value => (value ? 'Yes' : value === false ? 'No' : '')}
            />
            <Field
              name="aroma"
              component={FieldBinaryRadio}
              key="aroma"
              optionLabel={t('product.aroma')}
              helperText={t('product.aromaHelpText')}
              parse={value => value === 'Yes'}
              format={value => (value ? 'Yes' : value === false ? 'No' : '')}
            />

            {!isPrototype && (
              <div className={styles.sectionContainer}>
                <OutlinedInput
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={this.sendEdamamReq}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={event =>
                    this.setState({
                      ...this.state,
                      search: event.target.value
                    })
                  }
                  onKeyDown={this.keyPress}
                  placeholder={t('product.searchUsdaProduct')}
                  className={styles.searchBar}
                  fullWidth
                />
              </div>
            )}

            {this.state.submitSearch && (
              <USDAProductSearch
                query={this.state.search}
                data={results}
                getNutrients={this.sendEdamamReqProd}
                loading={loadingData}
              />
            )}

            {!isPrototype && (
              <span className={styles.disclaimer}>
                {t('product.usdaDisclaimer')}
              </span>
            )}

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

            {!isPrototype && (
              <div className={styles.sectionContainer}>
                <NutritionalInfo />
              </div>
            )}

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
              <RenderProductClassAttributes
                productClass="Date"
                currentProductClassAttributes={
                  pick(PRODUCT_CLASS_ATTRIBUTES, ['Date'])['Date']
                }
              />
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
              <ProductImageUpload name="images" />
            </div>

            <div className={styles.sectionContainer}>
              <FormSectionHeader text={t('product.nutritionalInfoImage')} />
              <ProductImageUpload name="nutritionalInfoImages" />
            </div>

            {/* <div className={styles.sectionContainer}>
              <AddPanel data={panels} />
            </div> */}
          </div>
        )}

        {activeStep === 3 && (
          <Field
            component={QuestionSelection}
            name="questions"
            data={questions}
            productCategory={this.state.productCategory}
          />
        )}

        <InvalidModal
          open={showInvalidModal}
          handleClose={() => this.setState({ showInvalidModal: false })}
          invalid={invalid}
          invalidFields={invalidFields}
        />

        <div className={styles.buttonContainer}>
          {activeStep < STEPS.length - 1 && (
            <MaterialButton
              variant="outlined"
              disabled={pristine || submitting}
              onClick={this.handleCreate}
              soft
            >
              {t('product.createProductQuick')}
            </MaterialButton>
          )}
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
              teal
            >
              {t('product.next')}
            </MaterialButton>
          )}
          {activeStep === STEPS.length - 1 && (
            <MaterialButton
              variant="outlined"
              disabled={pristine || invalid || submitting}
              onClick={this.handleCreate}
              soft
              teal
            >
              {t('product.createProduct')}
            </MaterialButton>
          )}
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  const values = state.form.PRODUCT_FORM.values;
  const name = values.name;
  const brand = values.brand;
  const allergens = values.allergens;
  const physicalState = values.physicalState;
  const productCategory = values.productCategory;
  const productFeature = values.productFeature;
  const productComponentBase = values.productComponentBase;
  const countryOfPurchase = values.countryOfPurchase;
  const country = values.country;
  const requiredFields = {
    name,
    brand,
    allergens,
    physicalState,
    productCategory,
    productFeature,
    productComponentBase,
    countryOfPurchase,
    country
  };
  const invalidFields = Object.keys(requiredFields).filter(
    field =>
      (Array.isArray(requiredFields[field]) && !requiredFields[field].length) ||
      requiredFields[field] === undefined
  );

  const allergenList = values.allergens;
  const hasNoAllergens =
    (allergenList &&
      allergenList.findIndex(a => a.label === 'No Allergens') > -1) ||
    false;
  const hasAllergens =
    allergenList &&
    allergenList.findIndex(a => ALL_ALLERGENS.indexOf(a.label) > -1) > -1;

  const isPrototype = values.prototype;
  const aroma = values.aroma;
  const hasTexture = values.texture;
  const definedComponents = values.definedComponents;

  return {
    producerId: selectWorkspaceProducerId(state),
    hasAllergens,
    hasNoAllergens,
    isPrototype,
    // aroma,
    invalidFields,
    hasTexture,
    definedComponents
  };
};

export default compose(
  connect(mapStateToProps),
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
  graphql(AvailablePanelQuery, {
    options: props => ({
      variables: {
        producerId: props.producerId
      }
    }),
    name: 'panels'
  }),
  graphql(AllQuestionQuery, {
    name: 'questions'
  }),
  withTranslation()
)(FormSectionProductConfiguration);
