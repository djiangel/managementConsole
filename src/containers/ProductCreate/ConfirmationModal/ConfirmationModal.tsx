import * as React from 'react';
import { FunctionComponent } from 'react';
import { Modal } from '../../../material/index';
// import {styles} from '../FormSectionProductConfiguration.module.css';
import MaterialButton from '../../../components/MaterialButton';
import NutritionalInfo from '../NutritionalInfo';
import { useTranslation } from 'react-i18next';
import FieldTextInput from '../../../components/FieldTextInput';
import { Field } from 'redux-form';
import FormSectionHeader from '../../../components/FormSectionHeader';


const styles = require('./ConfirmationModal.module.css');

type Props = {
  handleConfirm: () => any;
  handleCancel: () => any;
  open: boolean;
}

const ConfirmationModal: FunctionComponent<Props> = ({ handleConfirm, open, handleCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      className={styles.modal}
    >
      <div className={styles.modalContainer}>
        <h3>{t('reports.confirmation')}</h3>
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
            name="brand"
            component={FieldTextInput}
            fullWidth
            label={t('product.productBrand')}
            required
          />
        </div>

        <NutritionalInfo />

        <div className={styles.sectionContainer}>
          <FormSectionHeader text={t('product.ingredients')} />
          <Field
            name="ingredients"
            component={FieldTextInput}
            fullWidth
            placeholder={t('product.ingredientsPlaceholder')}
          />
        </div>

        <div className={styles.buttonContainer}>
          <MaterialButton
            variant="outlined"
            soft
            onClick={handleCancel}
          >
            {t('general.cancel')}
          </MaterialButton>
          <MaterialButton soft teal onClick={handleConfirm}>
            {t('general.confirm')}
          </MaterialButton>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal;