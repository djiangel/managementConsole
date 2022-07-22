import * as React from 'react';

import Modal from 'components/Modal';
import PanelProductTable from './PanelProductTable';

export function ConfirmationModal({ inAFSWorkspace, values, handleSubmit, setFieldValue, open, isSubmitting, onClose, editing, allowBehavioralQuestions }) {
	if (!open) {
		return null;
	}
	const action = editing ? 'update' : 'begin';
	return (
		<Modal
			title="Please Confirm"
			open={true}
			primaryAction={{
				// content: `Confirm and ${action} panel`,
				content: `Confirm`,
				action: handleSubmit,
				disabled: isSubmitting
			}}
			onClose={onClose}
		>
			<p>
				You are about to {action} a {values.blindPanel && 'blind'} panel
			</p>
			<p>Starting: {values.startTime.format('LLLL [GMT]Z ') + values.startTime.tz()}</p>
			<p>Ending: {values.endTime.format('LLLL [GMT]Z ') + values.endTime.tz()}</p>
			<p>Consisting of the following products</p>
			<PanelProductTable
				data={values.products}
				onClickRow={(p) => {
					setFieldValue('products', values.products.filter((x) => x.name !== p.name));
				}}
				blindPanel={values.blindPanel}
				setBlindLabel={(val, product) => {
					setFieldValue(`blindLabels.${product}`, val);
				}}

				afsWorkspaceBool={inAFSWorkspace}
				setServingVessel={(val, product) => {
					setFieldValue(`servingVessels.${product}`, val);
				}}
				setClientName={(val, product) => {
					setFieldValue(`clientNames.${product}`, val);
				}}
				setProjectName={(val, product) => {
					setFieldValue(`projectNames.${product}`, val);
				}}
				setTotalCost={(val, product) => {
					setFieldValue(`totalCosts.${product}`, val);
				}}
				setProductionDate={(val, product) => {
					setFieldValue(`productionDates.${product}`, val);
				}}
				setExpirationDate={(val, product) => {
					setFieldValue(`expirationDates.${product}`, val);
				}}
				setBehavioralQuestions={(val, product) => {
					setFieldValue(`behavioralQuestions.${product}`, val);
				}}
				blindLabels={values.blindLabels}
				servingVessels={values.servingVessels}
				clientNames={values.clientNames}
				projectNames={values.projectNames}
				totalCosts={values.totalCosts}
				productionDates={values.productionDates}
				expirationDates={values.expirationDates}
				behavioralQuestions={values.behavioralQuestions}
				editable={false}
				allowBehavioralQuestions={allowBehavioralQuestions}
			/>
		</Modal>
	);
}
