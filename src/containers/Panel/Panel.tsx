/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { ReactElement, useState } from 'react';
import ActivityIndicator from '../../components/ActivityIndicator';
import { useTranslation } from 'react-i18next';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { PANEL_CREATE, PANELS } from '../../constants/routePaths';
import PanelQuery from '../../graphql/queries/Panel';
import PanelListCell from '../../components/PanelListCell';
import { Input, InputAdornment, Paper, IconButton } from '../../material/index';
import { Search as SearchIcon } from '@material-ui/icons';
import { utc } from 'moment';
import { Link } from 'react-router-dom';
import MaterialButton from 'components/MaterialButton';
import PanelSearch from 'components/PanelSearch';
import DatePicker from '../../components/ProductClassAttributesInput/RenderDatePicker';

const styles = require('./Panel.module.css');

interface Props {
  loading?: boolean;
  renderPanel: (panel) => ReactElement;
  panel?: any;
}

const Panel: React.FunctionComponent<Props> = ({
  loading,
  renderPanel,
  panel
}) => {
  const { t } = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <Paper className={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <div>
          <div className={styles.headerContainer}>
            <div className={styles.headerTextContainer}>
              <h5 className={styles.panelHeader}>Panels</h5>
              <h3 className={styles.panelTitle}>{panel.pin}</h3>
            </div>
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
              <MaterialButton variant="outlined" soft teal size="small">
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
          <Link to={PANELS}>
            <MaterialButton variant="outlined" soft size="small">
              {t('panel.viewAllCurrentPanels')}
            </MaterialButton>
          </Link>
          <div className="row" key={panel.id}>
            {renderPanel(panel)}
          </div>
        </div>
      )}
    </Paper>
  );
};

Panel.displayName = 'PanelList';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  updateBlindLabel: state.updateBlindLabel
});

export default compose(
  connect(mapStateToProps),
  graphql(PanelQuery, {
    options: ({
      match: {
        params: { panelId }
      }
    }: any) => ({
      variables: {
        panelId: Number(panelId)
      }
    }),
    props: (props: any) => {
      const {
        data: { loading, panel }
      } = props;

      return {
        loading,
        panel,
        renderPanel: panel => {
          const endTime = utc(panel && panel.endTime);
          const startTime = utc(panel && panel.startTime);
          const now = utc();

          return (
            <PanelListCell
              id={panel.id}
              // producerId={this.props.producerId}
              blind={panel.blind}
              texture={panel.texture}
              key={panel.id}
              name={panel.name}
              panelists={panel.panelists && panel.panelists.nodes}
              pin={panel.pin}
              endTime={panel.endTime}
              products={
                panel.products &&
                panel.products.nodes &&
                panel.products.nodes.map(productNode => ({
                  name: productNode.product.name,
                  attributes: productNode.attributes,
                  reviews: productNode.productReviews.totalCount,
                  id: productNode.id,
                  blindLabel: productNode.blindLabel,
                  servingVessel: productNode.servingVessel,
                  clientName: productNode.clientName,
                  projectName: productNode.projectName,
                  totalCost: productNode.totalCost,
                  expirationDate: productNode.expirationDate,
                  productionDate: productNode.productionDate
                }))
              }
              reviewsCount={
                panel.productReviews && panel.productReviews.totalCount
              }
              tags={panel.tags && panel.tags.nodes}
              reviewDurationAggregateSeconds={panel.totalReviewDurationSeconds}
              reviewDurationAverageSeconds={panel.averageReviewDurationSeconds}
              startTime={panel.startTime}
              timeLimitSeconds={endTime.diff(startTime, 'seconds', true)}
              timeElapsedSeconds={
                startTime.isBefore(now) && now.diff(startTime, 'seconds', true)
              }
            />
          );
        }
      };
    }
  })
)(Panel);
