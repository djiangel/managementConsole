import * as React from 'react';
import { Modal } from '../../material/index';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../material/index';
import MaterialButton from 'components/MaterialButton';
import useStyles from './useStyles';

export function ConfirmUserDeleteModal({ modalVisible, onCancel, onDelete }) {
	const { t } = useTranslation();
	const classes = useStyles();
	if (!modalVisible) {
		return null;
	}
	return (
		<Modal open={modalVisible}>
			<div className={classes.modalContainer}>
				<div className={classes.iconWrapper}>
					<Avatar className={classes.icon} src={require('../../../public/assets/images/alert/alert.png')} />
				</div>
				<p className={classes.desc}>{t('deleteUserModal.Are you sure you\'d like to delete this user')}</p>
				<p className={classes.desc}>{t('deleteUserModal.This action cannot be reversed')}</p>
				<div className={classes.actionWrapper}>
					<div className={classes.buttonStyle}>
						<MaterialButton soft variant="outlined" onClick={() => onCancel()}>
							{t('deleteUserModal.cancel')}
						</MaterialButton>
					</div>
					<div className={classes.buttonStyle}>
						<MaterialButton
							onClick={() => onDelete()}
							soft
							variant="outlined"
							className={classes.deleteUserButton}
						>
							{t('deleteUserModal.delete')}
						</MaterialButton>
					</div>
				</div>
			</div>
		</Modal>
	);
}
