import * as React from 'react';
import { FunctionComponent } from 'react';
import { Modal } from '../../../material/index';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import FieldTextInput from '../../../components/FieldTextInput';
import { useQuery } from 'react-apollo-hooks';
import AllProductFeaturesQuery from '../../../graphql/queries/AllProductFeaturesQuery';
import AllProductCategoriesQuery from '../../../graphql/queries/AllProductCategoriesQuery';
import AllProductComponentBasesQuery from '../../../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../../../graphql/queries/AllProductComponentOthersQuery';
import FormInputSelect from 'components/FormInputSelect';
import FormInput from 'components/FormInput';

const styles = require('./TagModal.module.css');

type Props = {
  handleSubmit: () => any;
  handleClose: () => any;
  open: boolean;
  invalid: boolean;
  submitting: boolean;
  pristine: boolean;
  products: any[];
  producerId: number;
};

const TagModal: FunctionComponent<Props> = ({
  handleSubmit,
  handleClose,
  open,
  invalid,
  submitting,
  pristine,
  producerId
}) => {
  const { t } = useTranslation();
  const allProductFeaturesQuery = useQuery(AllProductFeaturesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductCategoriesQuery = useQuery(AllProductCategoriesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductComponentBasesQuery = useQuery(AllProductComponentBasesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductComponentOthersQuery = useQuery(AllProductComponentOthersQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });

  return (
    <Modal open={open} className={styles.modal}>
      <div className={styles.modalContainer}>
        <h3>Tag Feature</h3>

        <div className={styles.sectionContainer}>
          <Field
            name="feature"
            key="feature"
            component={FormInput}
            inputComponent={FormInputSelect}
            creatable
            isSearchable
            fullWidth
            labelText={t('product.productFeature')}
            options={!allProductFeaturesQuery.loading && allProductFeaturesQuery.data.productFeatures.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            placeholder={t('product.productFeature')}
            customLabel
            isClearable
          />
        </div>
        <div className={styles.sectionContainer}>
          <Field
            name="category"
            key="category"
            component={FormInput}
            inputComponent={FormInputSelect}
            creatable
            isSearchable
            fullWidth
            labelText={t('product.productCategory')}
            options={!allProductCategoriesQuery.loading && allProductCategoriesQuery.data.productCategories.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            placeholder={t('product.productCategory')}
            customLabel
            isClearable
          />
        </div>
        <div className={styles.sectionContainer}>
          <Field
            name="componentBase"
            key="componentBase"
            component={FormInput}
            inputComponent={FormInputSelect}
            creatable
            isSearchable
            fullWidth
            labelText={t('product.productComponentBase')}
            options={!allProductComponentBasesQuery.loading && allProductComponentBasesQuery.data.productComponentBases.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            placeholder={t('product.productComponentBase')}
            customLabel
            isClearable
          />
        </div>
        <div className={styles.sectionContainer}>
          <Field
            name="componentOther"
            key="componentOther"
            component={FormInput}
            inputComponent={FormInputSelect}
            creatable
            isSearchable
            fullWidth
            labelText={t('product.productComponentOther')}
            options={!allProductComponentOthersQuery.loading && allProductComponentOthersQuery.data.productComponentOthers.nodes.map(
              item => ({
                value: item.name,
                label: item.name
              })
            )}
            placeholder={t('product.productComponentOther')}
            customLabel
            isClearable
          />
        </div>

        <div className={styles.buttonContainer}>
          <MaterialButton variant="outlined" soft onClick={handleClose}>
            {t('general.cancel')}
          </MaterialButton>
          <MaterialButton
            soft
            teal
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
            disabled={invalid || pristine || submitting}
          >
            {t('general.confirm')}
          </MaterialButton>
        </div>
      </div>
    </Modal>
  );
};

export default TagModal;
