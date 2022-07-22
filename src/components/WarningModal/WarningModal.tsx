import * as React from 'react';
import { FunctionComponent } from 'react';
import Modal from '@material-ui/core/Modal';
import MaterialButton from '../MaterialButton';
import { useTranslation } from 'react-i18next';

const styles = require('./WarningModal.module.css');

type Props = {
  handleClose: () => any;
  open: boolean;
  message: any;
}

const WarningModal: FunctionComponent<Props> = ({ handleClose, open, message }) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      className={styles.modal}
    >
      <div className={styles.modalContainer}>
        <h6>{message}</h6>
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

export default WarningModal;