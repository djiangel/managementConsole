import i18next from "i18next";

export const validatePanelForm = (values) => {
	const errors: any = {};

	if (values.blindPanel || values.hideReviews) {
		if (Object.entries(values.blindLabels).length !== values.products.length) {
			errors.blindLabel = i18next.t('panel.blindLabelMandatory');
		}
		if (Object.values(values.blindLabels).indexOf('') > -1) {
			errors.blindLabel = i18next.t('panel.blindLabelMandatory');
		}
	}
	
	if (values.products.length < 1) {
		errors.products = i18next.t('panel.atLeastOneProduct');
	}
	
	if (!values.startTime || !values.endTime || !values.startTime.isValid() || !values.endTime.isValid()) {
		errors.startTime = i18next.t('panel.validDate');
	}
	
	if (values.startTime.isAfter(values.endTime)) {
		errors.startTime = i18next.t('panel.validEndDate');
	}

	return errors;
};
