/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import ActivityIndicator from '../../components/ActivityIndicator';
import {
  PANEL_CREATE,
  PANELS_EXPIRED,
  PANELS
} from '../../constants/routePaths';
import { Input, InputAdornment, Paper, IconButton } from '../../material/index';
import MaterialButton from 'components/MaterialButton';
import {
  Search as SearchIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from '@material-ui/icons';
import PanelSearch from '../../components/PanelSearch';
import ExpiredPanelsQuery from '../../graphql/queries/ExpiredPanels';
import DatePicker from '../../components/ProductClassAttributesInput/RenderDatePicker';
import { CAT_PANEL_LIST } from 'constants/googleAnalytics/categories';
import { event } from 'react-ga';
import {
  PAST_PANEL_LIST_NEXT,
  PAST_PANEL_LIST_PREV,
  VIEW_CURR_PANEL_LIST,
  VIEW_PAST_PANEL_LIST
} from 'constants/googleAnalytics/actions';
import VanityStatistics from 'containers/PanelList/PanelVanityStats';

const styles = require('./PanelList.module.css');

interface Props {
  loading: boolean;
  panels: any[];
  renderPanel: (product: Object) => ReactElement;
  title?: string;
  pastPanels?: boolean;
  t: Function;
  fetchMore?: any;
  pageInfo?: any;
  producerId: number;
}

const PanelList = ({
  loading,
  renderPanel,
  panels,
  pastPanels,
  fetchMore,
  pageInfo,
  producerId,
  t
}: Props) => {
  let shouldShowPanels = true;

  const [searchString, setSearchString] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (panels === undefined) {
    shouldShowPanels = false;
  } else if (panels.length === 0) {
    shouldShowPanels = false;
  }

  return (
    <Paper
      style={{
        width: '95%',
        maxWidth: '80%',
        padding: '4.2rem 3.2rem',
        position: 'relative'
      }}
    >
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h5 className={styles.panelHeader}>{t('navigation.panels')}</h5>
          <h3 className={styles.panelTitle}>
            {pastPanels ? t('panel.pastPanels') : t('panel.yourPanels')}
          </h3>
        </div>
        <div>
          <Input
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSearch(true)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            value={searchString}
            onChange={event => {
              setSearchString(event.target.value);
              setShowSearch(true);
            }}
            placeholder={t('panel.searchPanels')}
          />
        </div>

        <DatePicker
          value={startDate}
          onChange={date => {
            setStartDate(date);
            setShowSearch(true);
          }}
          placeholder={t('panel.startDate')}
          maxDate={endDate || undefined}
        />

        <DatePicker
          value={endDate}
          onChange={date => {
            setEndDate(date);
            setShowSearch(true);
          }}
          placeholder={t('panel.endDate')}
          minDate={startDate}
        />

        <Link to={PANEL_CREATE}>
          <MaterialButton variant="outlined" soft teal>
            {t('panel.createPanel')}
          </MaterialButton>
        </Link>
      </div>
      {(searchString.length > 0 || startDate || endDate) &&
        showSearch && (
          <PanelSearch
            first={10}
            isFloating
            query={searchString}
            hideSearch={() => setShowSearch(false)}
            startTime={startDate}
            endTime={endDate}
          />
        )}
      {pastPanels ? (
        <Link
          to={PANELS}
          onClick={() =>
            event({
              category: CAT_PANEL_LIST,
              action: VIEW_CURR_PANEL_LIST
            })
          }
        >
          <MaterialButton variant="outlined" soft size="small">
            {t('panel.viewAllCurrentPanels')}
          </MaterialButton>
        </Link>
      ) : (
        <Link
          to={PANELS_EXPIRED}
          onClick={() =>
            event({
              category: CAT_PANEL_LIST,
              action: VIEW_PAST_PANEL_LIST
            })
          }
        >
          <MaterialButton variant="outlined" soft size="small">
            {t('panel.viewPastPanels')}
          </MaterialButton>
        </Link>
      )}
      <VanityStatistics producerId={producerId} />
      {loading ? (
        <ActivityIndicator />
      ) : !shouldShowPanels ? (
        <p>{t('panel.noCurrentPanels')}</p>
      ) : (
        panels.map(panel => <div key={panel.id}>{renderPanel(panel)}</div>)
      )}
      {pastPanels && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <IconButton
            style={{ alignSelf: 'flex-start' }}
            disabled={!get(pageInfo, 'hasPreviousPage')}
            onClick={() => {
              event({
                category: CAT_PANEL_LIST,
                action: PAST_PANEL_LIST_PREV
              });
              fetchMore({
                query: ExpiredPanelsQuery,
                variables: {
                  producerId,
                  last: 3,
                  before: pageInfo.startCursor
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return fetchMoreResult;
                }
              });
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            style={{ alignSelf: 'flex-end' }}
            disabled={!get(pageInfo, 'hasNextPage')}
            onClick={() => {
              event({
                category: CAT_PANEL_LIST,
                action: PAST_PANEL_LIST_NEXT
              });
              fetchMore({
                query: ExpiredPanelsQuery,
                variables: {
                  producerId,
                  first: 3,
                  after: pageInfo.endCursor
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return fetchMoreResult;
                }
              });
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      )}
    </Paper>
  );
};

PanelList.displayName = 'PanelList';

export default PanelList;
