import * as React from 'react';
import { FunctionComponent } from 'react';
import { Modal } from '../../../material/index';
import { Field } from 'redux-form';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import FieldTextInput from '../../../components/FieldTextInput';

const styles = require('./RevisionModal.module.css');

type Props = {
  handleSubmit: () => any;
  handleClose: () => any;
  open: boolean;
  invalid: boolean;
  submitting: boolean;
  pristine: boolean;
};

const RevisionModal: FunctionComponent<Props> = ({
  handleSubmit,
  handleClose,
  open,
  invalid,
  submitting,
  pristine
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} className={styles.modal}>
      <div className={styles.modalContainer}>
        <h3>{t('reports.revision')}</h3>

        <div className={styles.sectionContainer}>
          <Field
            name="revision"
            component={FieldTextInput}
            fullWidth
            required
            label={t('reports.revisionComment')}
            multiline
            row={5}
          />
        </div>
        <div className={styles.sectionContainer}>
          <Field
            name="pdfLink"
            component={FieldTextInput}
            fullWidth
            required
            label={t('reports.newPdfLink')}
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

export default RevisionModal;
