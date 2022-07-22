import * as React from 'react';
import { LinearProgress, Modal, Paper, IconButton } from '../../material/index';
import { useQuery } from 'react-apollo-hooks';
import AllWorkspacesQuery from '../../graphql/queries/AllWorkspacesQuery';
import { ApolloConsumer } from 'react-apollo';
import FormInputSelect from 'components/FormInputSelect';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { PRODUCT_FILTER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import FormInput from 'components/FormInput';
import { COUNTRIES } from '../../constants/country';
import FieldTextInput from '../../components/FieldTextInput';
import gql from 'graphql-tag';
import AllProductCategoriesQuery from '../../graphql/queries/AllProductCategoriesQuery';
import AllProductFeaturesQuery from '../../graphql/queries/AllProductFeaturesQuery';
import AllProductComponentBasesQuery from '../../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../../graphql/queries/AllProductComponentOthersQuery';
import { connect } from 'react-redux';
import MaterialButton from '../../components/MaterialButton';
import ProductResult from './ProductResult';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { intersectionWith, startsWith } from 'lodash';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Location } from 'history';
import selectWorkspaceProducerName from '../../selectors/workspaceProducerName';

const styles = require('./ProductFilter.module.css');

interface Props {
  submitting: boolean;
  pristine: boolean;
  invalid: boolean;
  handleSubmit: () => void;
  submitted: boolean;
  change: (field: string, value: any) => void;
  producerId: number;
  reset: () => void;
  searchFilter?: any;
  versionNo: any;
  clearFields: any;
  workspaces: any;
  location: Location;
}

const ProductFilterCriteriaQuery = gql`
  query ProductFilterCriteriaQuery($query: String, $producerId: Int!) {
    filters: allProductFilterCriteria(
      condition: { producerId: $producerId }
      filter: { productSearchText: { includesInsensitive: $query } }
      first: 20
    ) {
      nodes {
        id
        productSearchText
        productCategories
        productFeatures
        productComponentBase
        productComponentOther
        ingredients
        physicalState
        countryOfOrigin
        countryOfPurchase
        producerIds

        versions: productFilterVersionsByProductFilterCriteriaId {
          totalCount
          nodes {
            id
            versionNo
            productIds
          }
        }
      }
    }
  }
`;

const ProductFilter: React.FunctionComponent<Props> = ({
  submitting,
  handleSubmit,
  invalid,
  pristine,
  submitted,
  change,
  producerId,
  reset,
  searchFilter,
  versionNo,
  clearFields,
  workspaces
}) => {
  const { t } = useTranslation();
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openSearchTextModal, setOpenSearchTextModal] = React.useState(false);
  const allWorkspacesQuery = useQuery(AllWorkspacesQuery);
  const allProductCategoriesQuery = useQuery(AllProductCategoriesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductFeaturesQuery = useQuery(AllProductFeaturesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductComponentBasesQuery = useQuery(
    AllProductComponentBasesQuery,
    {
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }
  );
  const allProductComponentOthersQuery = useQuery(
    AllProductComponentOthersQuery,
    {
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }
  );

  const handleSelectFilter = (event, newValue) => {
    clearFields(false, false, ['versionNo']);
    if (!newValue) {
      return;
    }
    const { value } = newValue;

    change(
      'categories',
      value.productCategories
        ? value.productCategories.split(',').map(
            item =>
              startsWith(item, '~')
                ? {
                    value: item.substring(1),
                    label: item.substring(1),
                    out: true
                  }
                : {
                    value: item,
                    label: item
                  }
          )
        : []
    );

    change(
      'features',
      value.productFeatures
        ? value.productFeatures.split(',').map(
            item =>
              startsWith(item, '~')
                ? {
                    value: item.substring(1),
                    label: item.substring(1),
                    out: true
                  }
                : {
                    value: item,
                    label: item
                  }
          )
        : []
    );

    const producerIdsArr = value.producerIds && value.producerIds.split(',');

    change(
      'workspaces',
      producerIdsArr
        ? intersectionWith(
            allWorkspacesQuery.data.allProducers.nodes,
            producerIdsArr,
            (a, b) => a.id === Number(startsWith(b, '~') ? b.substring(1) : b)
          ).map(item => ({
            label: item.name,
            value: item.id,
            out: startsWith(
              producerIdsArr.find(
                p => Number(startsWith(p, '~') ? p.substring(1) : p) === item.id
              ),
              '~'
            )
          }))
        : []
    );

    change(
      'componentBases',
      value.productComponentBase
        ? value.productComponentBase.split(',').map(
            item =>
              startsWith(item, '~')
                ? {
                    value: item.substring(1),
                    label: item.substring(1),
                    out: true
                  }
                : {
                    value: item,
                    label: item
                  }
          )
        : []
    );

    change(
      'componentOthers',
      value.productComponentOther
        ? value.productComponentOther.split(',').map(
            item =>
              startsWith(item, '~')
                ? {
                    value: item.substring(1),
                    label: item.substring(1),
                    out: true
                  }
                : {
                    value: item,
                    label: item
                  }
          )
        : []
    );
    change('ingredients', value.ingredients ? value.ingredients : '');

    const physicalStateArr =
      value.physicalState && value.physicalState.split(',');

    change(
      'physicalState',
      physicalStateArr
        ? intersectionWith(
            t('physicalState', { returnObjects: true }),
            physicalStateArr,
            (a, b) => (startsWith(b, '~') ? b.substring(1) : b) === a.value
          ).map(item => ({
            ...item,
            out: startsWith(
              physicalStateArr.find(
                ps =>
                  (startsWith(ps, '~') ? ps.substring(1) : ps) === item.value
              ),
              '~'
            )
          }))
        : []
    );

    const countryOfPurchaseArr =
      value.countryOfPurchase && value.countryOfPurchase.split(',');

    change(
      'countryOfPurchase',
      countryOfPurchaseArr
        ? intersectionWith(
            COUNTRIES.map(country => ({
              label: `${country.emoji} ${t(`country.${country.code}`)}`,
              value: country.code
            })),
            countryOfPurchaseArr,
            (a, b) => (startsWith(b, '~') ? b.substring(1) : b) === a.value
          ).map(item => ({
            ...item,
            out: startsWith(
              countryOfPurchaseArr.find(
                c => (startsWith(c, '~') ? c.substring(1) : c) === item.value
              ),
              '~'
            )
          }))
        : []
    );

    const countryOfOriginArr =
      value.countryOfOrigin && value.countryOfOrigin.split(',');

    change(
      'country',
      countryOfOriginArr
        ? intersectionWith(
            COUNTRIES.map(country => ({
              label: `${country.emoji} ${t(`country.${country.code}`)}`,
              value: country.code
            })),
            countryOfOriginArr,
            (a, b) => (startsWith(b, '~') ? b.substring(1) : b) === a.value
          ).map(item => ({
            ...item,
            out: startsWith(
              countryOfOriginArr.find(
                c => (startsWith(c, '~') ? c.substring(1) : c) === item.value
              ),
              '~'
            )
          }))
        : []
    );

    setOpenFilter(true);
  };

  if (
    allWorkspacesQuery.loading ||
    allProductCategoriesQuery.loading ||
    allProductComponentBasesQuery.loading ||
    allProductFeaturesQuery.loading ||
    allProductComponentOthersQuery.loading
  ) {
    return <LinearProgress />;
  }

  if (
    allWorkspacesQuery.error ||
    allProductCategoriesQuery.error ||
    allProductComponentBasesQuery.error ||
    allProductFeaturesQuery.error ||
    allProductComponentOthersQuery.error
  ) {
    return <div>Error Occured!</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {openFilter && (
        <Paper className={styles.filterContainer}>
          <div className={styles.filterHeader}>Filter</div>
          <Field
            name="workspaces"
            component={FormInput}
            inputComponent={FormInputSelect}
            customLabel
            labelText={t('general.workspace')}
            options={allWorkspacesQuery.data.allProducers.nodes.map(item => ({
              value: item.id,
              label: item.name
            }))}
            isMulti
            isSearchable
            isClearable
            checkbox
            isTriState
            isDisabled={!!searchFilter}
          />
          <Field
            name="categories"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="categories"
            labelText={t('product.productCategory')}
            options={allProductCategoriesQuery.data.productCategories.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            isSearchable
            isClearable
            isMulti
            placeholder={t('product.productCategory')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="features"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="features"
            labelText={t('product.productFeature')}
            options={allProductFeaturesQuery.data.productFeatures.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            isSearchable
            isClearable
            isMulti
            placeholder={t('product.productFeature')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="componentBases"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="componentBases"
            labelText={t('product.productComponentBase')}
            options={allProductComponentBasesQuery.data.productComponentBases.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            isSearchable
            isClearable
            isMulti
            placeholder={t('product.productComponentBase')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="componentOthers"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="componentOthers"
            labelText={t('product.productComponentOther')}
            options={allProductComponentOthersQuery.data.productComponentOthers.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            isSearchable
            isClearable
            isMulti
            placeholder={t('product.productComponentOther')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="physicalState"
            component={FormInput}
            inputComponent={FormInputSelect}
            customLabel
            labelText={t('product.physicalState')}
            options={t('physicalState', { returnObjects: true })}
            placeholder={t('product.physicalStatePlaceholder')}
            isMulti
            isSearchable
            isClearable
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="country"
            inputProps={{ readOnly: true }}
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
            isMulti
            placeholder={t('product.countryPlaceholder')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
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
            isMulti
            placeholder={t('product.countryPlaceholder')}
            customLabel
            checkbox
            isDisabled={!!searchFilter}
            isTriState
          />
          <Field
            name="ingredients"
            component={FieldTextInput}
            fullWidth
            customLabel
            placeholder={t('product.ingredientsPlaceholder')}
            label={'Ingredients'}
            disabled={!!searchFilter}
          />

          {!searchFilter && (
            <MaterialButton
              variant="outlined"
              disabled={pristine}
              onClick={reset}
              soft
            >
              Reset
            </MaterialButton>
          )}
        </Paper>
      )}

      <Paper className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <h5 className={styles.productHeader}>{t('navigation.products')}</h5>
            <h3 className={styles.productTitle}>
              {t('product.productFilter')}
            </h3>
          </div>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <ApolloConsumer>
                {client => (
                  <React.Fragment>
                    <Field
                      name="searchFilter"
                      component={FormInput}
                      inputComponent={FormInputSelect}
                      async
                      fullWidth
                      placeholder={'Search for saved filters'}
                      loadOptions={async value => {
                        if (value && value.trim().length < 3) {
                          return [];
                        }

                        const { data } = await client.query({
                          query: ProductFilterCriteriaQuery,
                          variables: {
                            query: value,
                            producerId: producerId
                          }
                        });

                        if (data && data.filters) {
                          return data.filters.nodes.map(filter => ({
                            label: `${filter.productSearchText}`,
                            value: filter
                          }));
                        }
                        return [];
                      }}
                      onChange={handleSelectFilter}
                    />
                    {searchFilter && (
                      <Field
                        key={searchFilter}
                        name="versionNo"
                        component={FormInput}
                        inputComponent={FormInputSelect}
                        isClearable
                        // async
                        fullWidth
                        placeholder={'Select saved products version'}
                        options={
                          !searchFilter
                            ? []
                            : searchFilter.value.versions.nodes
                                .sort((v1, v2) => v1.versionNo - v2.versionNo)
                                .map(v => ({ value: v, label: v.versionNo }))
                        }
                      />
                    )}
                  </React.Fragment>
                )}
              </ApolloConsumer>
            </div>
            <IconButton
              onClick={() => {
                setOpenFilter(!openFilter);
                change('selectedProducts', []);
              }}
            >
              <FilterListIcon />
            </IconButton>
          </div>
          <MaterialButton
            variant="outlined"
            disabled={pristine || invalid || submitting}
            onClick={() =>
              searchFilter ? handleSubmit() : setOpenSearchTextModal(true)
            }
            soft
            teal
          >
            {t('admin.saveFilter')}
          </MaterialButton>
        </div>
        {/* <div>
          <MaterialButton
            variant="outlined"
            teal
            soft
            onClick={() => {
              setOpenFilter(!openFilter);
              change('editing', !editing);
              change('selectedProducts', []);
            }}
          >
            {openFilter ? t('product.closeFilter') : t('product.openFilter')}
          </MaterialButton>
        </div> */}

        <ProductResult
          change={change}
          savedProducts={
            versionNo &&
            versionNo.value.productIds.split(',').map(id => parseInt(id))
          }
        />
      </Paper>

      <Modal open={openSearchTextModal} className={styles.modal}>
        <div className={styles.modalContainer}>
          <div className={styles.sectionContainer}>
            <Field
              name="productSearchText"
              component={FieldTextInput}
              fullWidth
              required
              label={t('product.filterNameLabel')}
            />
          </div>
          <div className={styles.buttonContainer}>
            <MaterialButton
              variant="outlined"
              soft
              onClick={() => setOpenSearchTextModal(false)}
            >
              {t('general.cancel')}
            </MaterialButton>
            <MaterialButton
              soft
              teal
              onClick={() => {
                handleSubmit();
                setOpenSearchTextModal(false);
              }}
              disabled={invalid || pristine || submitting}
            >
              {t('general.confirm')}
            </MaterialButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { location } = props;
  console.log(location);
  const values = getFormValues(PRODUCT_FILTER_FORM)(state);
  console.log(values);
  const initialValues = {
    selectedProducts: [],
    categories:
      location.state && location.state.categories
        ? location.state.categories.map(c => ({
            value: c,
            label: c
          }))
        : [],
    workspaces:
      location.state && location.state.categories && {
        value: selectWorkspaceProducerId(state),
        label: selectWorkspaceProducerName(state)
      }
    // componentBases:
    //   location.state && location.state.componentBases
    //     ? location.state.componentBases.map(cb => ({
    //         value: cb,
    //         label: cb
    //       }))
    //     : [],
    // componentOthers:
    //   location.state && location.state.componentOthers
    //     ? location.state.componentOthers.map(co => ({
    //         value: co,
    //         label: co
    //       }))
    //     : [],
    // features:
    //   location.state && location.state.features
    //     ? location.state.features.map(f => ({ value: f, label: f }))
    //     : []
  };
  return values
    ? {
        workspaceIds: values.workspaces,
        submitted: values.submitted,
        searchFilter: values.searchFilter,
        versionNo: values.versionNo,
        producerId: selectWorkspaceProducerId(state),
        workspaces: values.workspaces,
        productIds: location && location.state && location.state.productIds,
        initialValues
      }
    : {
        producerId: selectWorkspaceProducerId(state),
        initialValues
      };
};

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default compose<{}>(
  connect(mapStateToProps),
  reduxForm({
    form: PRODUCT_FILTER_FORM,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(PRODUCT_FILTER_FORM));
    },
    validate: values => {
      return {
        productSearchText:
          !values.searchFilter && validation(values.productSearchText)
      };
    }
  })
)(ProductFilter);
