import * as React from 'react';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import { Moment } from 'moment';
import { PDFExport } from '@progress/kendo-react-pdf';
import { withTranslation, WithTranslation } from 'react-i18next';
import PanelHeader from '../PanelHeader';
import ProgressBar from '../ProgressBar';
import Table from '../Table';
import Alert from '../../components/Alert/Alert';
import ExtendPanelTimeModal from './ExtendPanelTimeModal';
import FormInputTag from 'components/FormInputTag';
import MaterialButton from 'components/MaterialButton';
import DeletePanelModal from './DeletePanelModal';
import { event } from 'react-ga';
import { CAT_PANEL_LIST } from 'constants/googleAnalytics/categories';
import {
  PANEL_LIST_DQD_OPEN,
  PANEL_LIST_EDIT_OPEN,
  PANEL_LIST_OPEN_CELL,
  PANEL_LIST_CLOSE_CELL,
  PANEL_DOWNLOAD
} from 'constants/googleAnalytics/actions';

const styles = require('./PanelList.module.css');

interface PanelListCellComponentProps extends WithTranslation {
  onPressDelete: () => void;
  producerId: any;
  pin: number;
  id: number;
  timeElapsedSeconds: number;
  timeLimitSeconds: number;
  blind: boolean;
  texture: boolean;
  reviewsCount: number;
  reviewDurationAverageSeconds: number;
  reviewDurationAggregateSeconds: number;
  tags: any[];
  products: any[];
  panelists: any[];
  productRows: JSX.Element[];
  successUpdating: boolean;
  errorUpdating: boolean;
  updating: boolean;
  updateBlindLabel: () => void;
  handleEndNow: () => void;
  handleExtendPanel: (newEndTime: any) => Promise<void>;
  setShowExtendPanelTime: (a: boolean) => void;
  showExtendPanelTime: boolean;
  newPanelEndTime: Moment;
  setNewPanelEndTime: (a: Date) => void;
  endTime: Date;
  startTime: Date;
  name: string;
  colorCode?: string;
}

class PanelListCellComponent extends React.Component<
  PanelListCellComponentProps
> {
  panelListCellComponent;

  state = {
    hasExpanded: false
  };

  setHasExpanded = state => this.setState({ hasExpanded: state });

  exportPdf = () => {
    event({
      category: CAT_PANEL_LIST,
      action: PANEL_DOWNLOAD,
      label: this.props.pin.toString()
    });
    this.panelListCellComponent.save();
  };

  render() {
    let {
      id,
      producerId,
      onPressDelete,
      pin,
      timeElapsedSeconds,
      timeLimitSeconds,
      blind,
      texture,
      reviewsCount,
      reviewDurationAggregateSeconds,
      reviewDurationAverageSeconds,
      tags,
      products,
      panelists,
      productRows,
      successUpdating,
      errorUpdating,
      updating,
      handleEndNow,
      handleExtendPanel,
      updateBlindLabel,
      setShowExtendPanelTime,
      showExtendPanelTime,
      newPanelEndTime,
      setNewPanelEndTime,
      endTime,
      startTime,
      name,
      colorCode,
      t
    } = this.props;
    const { hasExpanded } = this.state;
    const currentTime = moment();

    return (
      <div className={styles.container}>
        <ExtendPanelTimeModal
          showExtendPanelTime={showExtendPanelTime}
          setShowExtendPanelTime={setShowExtendPanelTime}
          newPanelEndTime={newPanelEndTime}
          setNewPanelEndTime={setNewPanelEndTime}
          handleExtendPanel={handleExtendPanel}
        />
        <PDFExport
          fileName={`Panel_${pin}`}
          ref={component => (this.panelListCellComponent = component)}
          paperSize="Letter"
          scale={0.5}
          margin="0.5in"
        >
          <PanelHeader
            colorCode={colorCode}
            renderRightContents={() => (
              <div>
                <Link
                  to={`/panels/${id}/edit`}
                  onClick={() =>
                    event({
                      category: CAT_PANEL_LIST,
                      action: PANEL_LIST_EDIT_OPEN,
                      label: pin.toString()
                    })
                  }
                >
                  <span className={styles.editText}>
                    {t('panel.editPanel')}
                  </span>
                </Link>
                <Link
                  to={`/panels/${id}/data-quality-dashboard`}
                  onClick={() =>
                    event({
                      category: CAT_PANEL_LIST,
                      action: PANEL_LIST_DQD_OPEN,
                      label: pin.toString()
                    })
                  }
                >
                  <span className={styles.editText}>
                    Data Quality Dashboard
                  </span>
                </Link>
              </div>
            )}
            pin={pin}
            name={name}
            toggleExpansion={() => {
              this.setHasExpanded(!hasExpanded);
              event({
                category: CAT_PANEL_LIST,
                action: hasExpanded
                  ? PANEL_LIST_CLOSE_CELL
                  : PANEL_LIST_OPEN_CELL,
                label: pin.toString()
              });
            }}
            hasExpanded={hasExpanded}
          />
          {hasExpanded && (
            <div>
              <ProgressBar value={timeElapsedSeconds / timeLimitSeconds} />
              <div className={styles.panelInfoContainer}>
                <div className={styles.panelInfo}>
                  <span className={styles.panelInfoTitle}>
                    {t('panel.blind')}?
                  </span>
                  <span className={styles.panelInfoText}>
                    {blind ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={styles.panelInfo}>
                  <span className={styles.panelInfoTitle}>
                    {t('panel.textureMandatory')}?
                  </span>
                  <span className={styles.panelInfoText}>
                    {texture ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className={styles.panelInfo}>
                  <span className={styles.panelInfoTitle}>
                    {t('panel.startTime')}
                  </span>
                  <span className={styles.panelInfoText}>
                    {moment
                      .utc(startTime)
                      .local()
                      .format('MM-DD-YYYY HH:mm:ss zz')}
                  </span>
                </div>
                <div className={styles.panelInfo}>
                  <span className={styles.panelInfoTitle}>
                    {t('panel.endTime')}
                  </span>
                  <span className={styles.panelInfoText}>
                    {moment
                      .utc(endTime)
                      .local()
                      .format('MM-DD-YYYY HH:mm:ss zz')}
                  </span>
                </div>
                <div className={styles.panelInfo}>
                  <span className={styles.panelInfoTitle}>
                    {t('panel.averageDuration')}
                  </span>
                  <span className={styles.panelInfoText}>
                    {moment
                      .utc(reviewDurationAverageSeconds * 1000)
                      .format('HH:mm:ss')}
                  </span>
                </div>
              </div>
              <div>
                <div className={styles.sectionDivider}>
                  <span className={styles.sectionTitle}>
                    {t('panel.panelTag')}
                  </span>
                </div>
                <div className={styles.sectionContentContainer}>
                  {tags.length === 0 ? (
                    <span className={styles.sectionText}>
                      {t('general.noTagSelected')}
                    </span>
                  ) : (
                    <FormInputTag
                      defaultTags={tags.map(panelTag => ({
                        label: panelTag.tag.tag.toLowerCase(),
                        id: panelTag.tag.id.toString()
                      }))}
                      readOnly
                      uneditable
                    />
                  )}
                </div>
              </div>
              <div className="productsWrapper">
                <div className={styles.sectionDivider}>
                  <span className={styles.sectionTitle}>
                    {t('navigation.products')}
                  </span>
                </div>
                <Table
                  renderHeaderRow={() => (
                    <tr>
                      <th style={{ width: 200 }}>{t('product.productName')}</th>
                      <th style={{ width: 175 }}>{t('product.attributes')}</th>
                      {/* <th style={{ width: 40 }}>{t('product.prototypeProduct')}</th> */}
                      <th>{t('panel.expirationDate')}</th>
                      <th>{t('panel.productionDate')}</th>
                      <th>{t('panel.totalReviews')}</th>
                      <th>{t('panel.blindLabel')}</th>
                      <th>{t('panel.servingVessel')}</th>

                      {producerId == 25 && <th>{t('panel.clientName')}</th>}
                      {producerId == 25 && <th>{t('panel.projectName')}</th>}
                      {producerId == 25 && <th>{t('panel.totalCost')}</th>}
                    </tr>
                  )}
                >
                  {productRows}
                </Table>
              </div>
              <div className="panelistsWrapper">
                <div className={styles.sectionDivider}>
                  <span className={styles.sectionTitle}>
                    {t('panel.panelists')}
                  </span>
                </div>
                <div className={styles.sectionContentContainer}>
                  {panelists && panelists.length ? (
                    <span className={styles.sectionText}>
                      {panelists.map(panelist => panelist.name).join(', ')}
                    </span>
                  ) : (
                    <div className={styles.sectionText}>
                      {t('panel.noPanelists')}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className={styles.sectionDivider}>
                  <span className={styles.sectionTitle}>
                    {t('reviews.reviews')}
                  </span>
                </div>
                <div className={styles.sectionContentContainer}>
                  <span className={styles.sectionText}>{reviewsCount}</span>
                </div>
              </div>

              {successUpdating && (
                <Alert type="success">{t('panel.panelUpdateSuccess')}</Alert>
              )}
              {errorUpdating && (
                <Alert type="error">{t('panel.panelUpdateError')}</Alert>
              )}
              <div className={styles.buttonContainer}>
                <MaterialButton
                  variant="outlined"
                  soft
                  style={{ marginRight: 15 }}
                  onClick={() => setShowExtendPanelTime(true)}
                  disabled={currentTime.isAfter(endTime)}
                >
                  {t('panel.extendPanel')}
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  soft
                  style={{ marginRight: 15 }}
                  onClick={this.exportPdf}
                >
                  Download
                </MaterialButton>
                <DeletePanelModal
                  handleEndNow={handleEndNow}
                  panelName={name}
                  panelPin={pin}
                  currentTime={currentTime}
                  endTime={endTime}
                />
              </div>
            </div>
          )}
        </PDFExport>
      </div>
    );
  }
}

export default withTranslation()(PanelListCellComponent);
