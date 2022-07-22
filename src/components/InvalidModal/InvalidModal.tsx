import * as React from 'react';
import { FunctionComponent } from 'react';
import Modal from '@material-ui/core/Modal';
import MaterialButton from '../MaterialButton';
import { useTranslation } from 'react-i18next';

const styles = require('./InvalidModal.module.css');

type Props = {
  handleClose: () => any;
  open: boolean;
  invalid: boolean;
  invalidFields: any;
}

const InvalidModal: FunctionComponent<Props> = ({ handleClose, open, invalid, invalidFields }) => {
  const { t } = useTranslation();
  const FIELD_NAMES = {
    prototype: t('product.prototype'),
    name: t('product.productName'),
    brand: t('product.productBrand'),
    allergens: t('product.allergenInfo'),
    physicalState: t('product.physicalState'),
    productCategory: t('product.productCategory'),
    productComponentBase: t('product.productComponentBase'),
    productFeature: t('product.productFeature'),
    country: t('product.countryOfOrigin'),
    countryOfPurchase: t('product.countryOfPurchase')
  }
  return (
    <Modal
      open={open}
      className={styles.modal}
    >
      <div className={styles.modalContainer}>
        <h4>{t('invalidModal.title')}</h4>
        <div className={styles.sectionContainer}>
            {invalid 
            ?  Object.keys(FIELD_NAMES).map(field => invalidFields.includes(field) 
            ? <p>{FIELD_NAMES[field]}</p>
            : null)
             : 'All fields are filled'
             }
        </div>

        <div className={styles.buttonContainer}>
          <MaterialButton
            variant="outlined"
            soft
            teal
            onClick={handleClose}
          >
            {t('invalidModal.ok')}
          </MaterialButton>
        </div>
      </div>
    </Modal>
  )
}

export default InvalidModal;