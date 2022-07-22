import * as React from 'react';
import { Paper } from '../../material/index';
import PanelSearch from '../../components/PanelSearch';
import { useTranslation } from 'react-i18next';

const styles = require('./PanelSearchResults.module.css');

interface Props {
	match?: any;
}

const PanelSearchResults: React.FunctionComponent<Props> = ({ match }) => {
	const query = decodeURI(match.params.query);
	const startTime = decodeURI(match.params.startTime);
	const endTime = decodeURI(match.params.endTime);
	const { t } = useTranslation();
	console.log()

	return (
		<Paper className={styles.container}>
			<h5 className={styles.panelHeader}>{t('navigation.panels')}</h5>
			<h3 className={styles.panelSearchTitle}>{t('panel.searchResult', { query: query })}</h3>
			<PanelSearch
				first={10}
				query={query}
				startTime={startTime !== "null" ? new Date(startTime) : null}
				endTime={endTime !== "null" ? new Date(endTime) : null}
			/>
		</Paper>
	);
};

export default PanelSearchResults;
