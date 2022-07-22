import * as React from 'react';
import { FunctionComponent } from 'react';
import { Modal } from '../../../material/index';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';

const styles = require('./AcceptModal.module.css');

type Props = {
  handleSubmit: () => any;
  handleClose: () => any;
  open: boolean;
};

const AcceptModal: FunctionComponent<Props> = ({
  handleSubmit,
  handleClose,
  open,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} className={styles.modal}>
      <div className={styles.modalContainer}>
        <h3>{t('reports.acceptModalTitle')}</h3>
        <p>{t('reports.acceptModalDescription')}</p>

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
          >
            {t('general.confirm')}
          </MaterialButton>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptModal;
