import * as React from 'react';
import { ReactElement } from 'react';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import MaterialButton from '../MaterialButton';

interface Props {
  classes?: {
    root: string;
    closeButton: string;
  };
  onClose: () => void;
  id?: string;
  children: ReactElement;
}

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: spacing(1),
      top: spacing(1),
      color: palette.grey[500]
    }
  });

const DialogTitle = withStyles(styles)(
  ({ children, classes, onClose }: Props) => {
    return (
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  }
);

const DialogContent = withStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(({ spacing }: Theme) => ({
  root: {
    margin: 0,
    padding: spacing(1)
  }
}))(MuiDialogActions);

const DeletePanelModal = ({
  handleEndNow,
  panelName,
  panelPin,
  endTime,
  currentTime
}) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MaterialButton
        variant="outlined"
        soft
        onClick={handleClickOpen}
        disabled={currentTime.isAfter(endTime)}
      >
        {t('panel.endPanel')}
      </MaterialButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <span>{t('archiveModal.title')}</span>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {t('archiveModal.message')} {panelName}({panelPin})
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleEndNow}>
            {t('archiveModal.archive')}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            {t('archiveModal.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletePanelModal;
