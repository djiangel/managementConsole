import * as React from 'react';
import Modal from 'components/Modal';
import { useTranslation } from 'react-i18next';

export function WarningModal({ modalVisible, closeModal, handleConfirmNavigationClick }) {
	const { t } = useTranslation();
	if (!modalVisible) {
		return null;
	}
	return (
		<Modal
			modalStyle
			styledTitle={<h5>{t('warningModal.title')}</h5>}
			open={modalVisible}
			onClose={closeModal}
			primaryAction={{
				content: t('warningModal.Leave this Page'),
				action: handleConfirmNavigationClick
			}}
			cancelContent={t('warningModal.Stay on this Page')}
		>
			<p>{t('warningModal.info')}</p>
			<p>{t('warningModal.subInfo')}</p>
		</Modal>
	);
}
