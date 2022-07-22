import * as React from 'react';
import { FunctionComponent } from 'react';
import { Modal, Grid } from '../../../material/index';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import MaterialButton from '../../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import FieldTextInput from '../../../components/FieldTextInput';
import FieldBinaryRadio from '../../../components/FieldBinaryRadio';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';


const styles = require('./CommentsModal.module.css');

type Props = {
  classes: {
    right: string;
    item: string;
    modalHeader: string;
  }
  handleSubmit: () => any;
  handleClose: () => any;
  open: boolean;
  checkFormatting: boolean;
  checkComparative: boolean;
  checkFlavorProfile: boolean;
  checkSanityCheck: boolean;
  checkPqModel: boolean;
  checkRequest: boolean;
  checkArchetype: boolean;
  checkOther: boolean;
};

const CommentsModal: FunctionComponent<Props> = ({
  handleSubmit,
  handleClose,
  open,
  checkFormatting,
  checkComparative,
  checkFlavorProfile,
  checkSanityCheck,
  checkPqModel,
  checkRequest,
  checkArchetype,
  checkOther,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} className={styles.modal}>
      <div className={styles.modalContainer}>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12}>
            <div className={classes.modalHeader}>{t('reports.evaluation')}</div>
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }}>
            <div className={styles.sectionContainer}>
              <Field
                name="formatting"
                component={FieldBinaryRadio}
                key="formatting"
                fullWidth
                label={t('reports.formatting')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkFormatting && (
                <Field
                  name="formattingComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.formatting')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="comparative"
                component={FieldBinaryRadio}
                key="comparative"
                fullWidth
                label={t('reports.comparative')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkComparative && (
                <Field
                  name="comparativeComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.comparative')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="flavorProfile"
                component={FieldBinaryRadio}
                key="flavorProfile"
                fullWidth
                label={t('reports.flavorProfile')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkFlavorProfile && (
                <Field
                  name="flavorProfileComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.flavorProfile')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="sanityCheck"
                component={FieldBinaryRadio}
                key="sanityCheck"
                fullWidth
                label={t('reports.sanityCheck')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkSanityCheck && (
                <Field
                  name="sanityCheckComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.sanityCheck')}
                  multiline
                  row={5}
                />
              )}
            </div>
          </Grid>

          <Grid item xs={6} classes={{ root: classes.right, item: classes.item }}>
            <div className={styles.sectionContainer}>
              <Field
                name="pqModel"
                component={FieldBinaryRadio}
                key="pqModel"
                fullWidth
                label={t('reports.pqModel')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkPqModel && (
                <Field
                  name="pqModelComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.pqModel')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="request"
                component={FieldBinaryRadio}
                key="request"
                fullWidth
                label={t('reports.request')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkRequest && (
                <Field
                  name="requestComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.request')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="archetype"
                component={FieldBinaryRadio}
                key="archetype"
                fullWidth
                label={t('reports.archetype')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkArchetype && (
                <Field
                  name="archetypeComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.archetype')}
                  multiline
                  row={5}
                />
              )}
            </div>
            <div className={styles.sectionContainer}>
              <Field
                name="other"
                component={FieldBinaryRadio}
                key="other"
                fullWidth
                label={t('reports.other')}
                parse={value => value === 'Yes'}
                format={value => (value ? 'Yes' : value === false ? 'No' : '')}
              />
              {checkOther && (
                <Field
                  name="otherComment"
                  component={FieldTextInput}
                  fullWidth
                  placeholder={t('reports.commentPlaceholder')}
                  label={t('reports.other')}
                  multiline
                  row={5}
                />
              )}
            </div>
          </Grid>
        </Grid>
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

const mapStateToProps = state => {
  const values = state.form.REPORT_QA_FORM.values;
  const checkFormatting = values.formatting;
  const checkComparative = values.comparative;
  const checkFlavorProfile = values.flavorProfile;
  const checkSanityCheck = values.sanityCheck;
  const checkPqModel = values.pqModel;
  const checkRequest = values.request;
  const checkArchetype = values.archetype;
  const checkOther = values.other;

  return {
    checkFormatting,
    checkComparative,
    checkFlavorProfile,
    checkSanityCheck,
    checkPqModel,
    checkRequest,
    checkArchetype,
    checkOther
  };
};

export default compose(
  connect(mapStateToProps),
  withStyles(theme => ({
    right: {
      borderLeft: '3px solid' + theme.palette.secondary.main
    },
    item: {
      paddingLeft: '24px',
      paddingRight: '24px'
    },
    modalHeader: {
      fontFamily: 'AlphaHeadlinePro-Bold, sans-serif',
      fontSize: '24px',
      color: theme.palette.secondary.main,
      textAlign: 'center'
    }
  })))(CommentsModal);
