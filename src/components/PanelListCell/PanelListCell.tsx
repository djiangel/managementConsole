import * as React from 'react';
import { Component } from 'react';
import * as moment from 'moment';
import { WithTranslation, withTranslation } from 'react-i18next';
import UpdatePanelMutation from '../../graphql/mutations/UpdatePanel';
import CreateNotificationMutation from '../../graphql/mutations/CreateNotification';
import CreateNotificationTypeMutation from '../../graphql/mutations/CreateNotificationType';
import UserNotificationsQuery from '../../graphql/queries/UserNotificationsQuery';
import UserNotificationsByPanelIdQuery from '../../graphql/queries/UserNotificationsByPanelIdQuery';
import { graphql } from 'react-apollo';
import graphqlClient from '../../consumers/graphqlClient';
import PanelListCellComponent from './PanelListCellComponent';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import selectViewerUserId from '../../selectors/viewerUserId';
import { ROLE_ENUM, NOTIFICATION_TYPE_ENUM } from '../../constants/enum';

import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { event } from 'react-ga';
import { PANEL_END, PANEL_EXTEND } from 'constants/googleAnalytics/actions';
import { CAT_PANEL_LIST } from 'constants/googleAnalytics/categories';

interface Props {
  id: number;
  producerId?: any;
  viewerUserId?: any;
  blind?: boolean;
  onPressDelete?: () => any;
  panelists: any[];
  pin: number;
  products: any[];
  reviewsCount: number;
  reviewDurationAggregateSeconds: number;
  reviewDurationAverageSeconds: number;
  timeLimitSeconds: number;
  changeBlindLabel?: () => any;
  updateBlindLabel?: () => void;
  texture: any;
  tags: any[];
  timeElapsedSeconds: number;
  startTime: Date;
  endTime: Date;
  name: string;
  userNotificationsByPanelId?: any;
  colorCode?: string;
}

class PanelListCell extends Component<Props & WithTranslation, any> {
  state = {
    timeElapsedSeconds: 0,
    updating: false,
    errorUpdating: null,
    successUpdating: null,
    showExtendPanelTime: false,
    newPanelEndTime: moment()
  };

  componentWillMount = () => {
    const currentTime = moment();
    const endTime = this.props.endTime;

    const { data, loading } = this.props.userNotificationsByPanelId;
    if (
      !loading &&
      data &&
      data.totalCount === 0 &&
      currentTime.isAfter(endTime)
    ) {
      this.createNotification();
    }
  };

  updatePanelEndTime = async endTime => {
    const panelId = this.props.id;
    await graphqlClient.mutate({
      mutation: UpdatePanelMutation,
      variables: {
        id: panelId,
        panelPatch: {
          endTime: endTime
        }
      },
      refetchQueries: ['AvailablePanelsQuery']
    });
  };

  endPanel = () => {
    // set end time to current time to end panel
    const endTime = new Date().toISOString();

    this.updatePanelEndTime(endTime);
    this.createNotification();
  };

  createNotification = async () => {
    const panelId = this.props.id;
    const endTime = new Date().toISOString();

    const {
      data: {
        createNotificationType: {
          notificationType: { id: notificationTypeId }
        }
      }
    } = await graphqlClient.mutate({
      mutation: CreateNotificationTypeMutation,
      variables: {
        notificationType: {
          panelId,
          role: ROLE_ENUM.GASTROGRAPH_USER,
          notificationType: NOTIFICATION_TYPE_ENUM.COMPLETED_PANEL,
          sentOn: endTime
        }
      }
    });

    await graphqlClient.mutate({
      mutation: CreateNotificationMutation,
      variables: {
        notification: {
          userId: this.props.viewerUserId,
          producerId: this.props.producerId,
          active: true,
          notificationTypeId: notificationTypeId
        }
      },
      refetchQueries: [
        {
          query: UserNotificationsQuery,
          variables: {
            producerId: this.props.producerId,
            active: true
          }
        }
      ]
    });
  };

  handleEndNow = () => {
    event({
      category: CAT_PANEL_LIST,
      action: PANEL_END,
      label: this.props.pin.toString()
    });
    this.endPanel();
  };

  extendPanel = async newEndTime => {
    event({
      category: CAT_PANEL_LIST,
      action: PANEL_EXTEND,
      label: this.props.pin.toString()
    });
    this.updatePanelEndTime(newEndTime);
  };

  handleChangeValue = (val, productId) => {
    this.setState({ [productId]: val });
  };

  printWords = () => {
    console.log('Print');
  };

  setShowExtendPanelTime = a => {
    this.setState({ showExtendPanelTime: a });
  };

  setNewPanelEndTime = a => {
    this.setState({ newPanelEndTime: a });
  };

  generateProductRows = () => {
    return this.props.products.map(product => {
      const productId = `panel-${this.props.id}-product-${product.id}-label`;
      const currWorkspace = this.props.producerId;

      return (
        <tr key={productId}>
          <td className="name">{product.name}</td>
          <td className="attributes">
            {product.attributes
              ? JSON.stringify(product.attributes)
              : `Normal ${product.name}`}
          </td>
          {/* <td>
            {product.prototype && <CheckCircleOutline color="secondary" />}
          </td> */}
          <td className="reviews">{product.expirationDate}</td>
          <td className="reviews">{product.productionDate}</td>
          <td className="reviews">
            {product.reviews} {this.props.t('reviews.reviews')}
          </td>
          <td>{this.props.blind && product.blindLabel}</td>

          <td className="reviews">{product.servingVessel}</td>

          {currWorkspace == 25 && (
            <td className="reviews">{product.clientName}</td>
          )}
          {currWorkspace == 25 && (
            <td className="reviews">{product.projectName}</td>
          )}
          {currWorkspace == 25 && (
            <td className="reviews">{product.totalCost}</td>
          )}
        </tr>
      );
    });
  };

  render() {
    const {
      blind,
      texture,
      onPressDelete,
      panelists,
      pin,
      products,
      reviewsCount,
      reviewDurationAggregateSeconds,
      reviewDurationAverageSeconds,
      tags,
      timeLimitSeconds,
      timeElapsedSeconds,
      updateBlindLabel,
      startTime,
      endTime,
      name,
      id,
      colorCode,
      producerId
    } = this.props;
    const {
      successUpdating,
      errorUpdating,
      updating,
      newPanelEndTime
    } = this.state;

    const productRows = this.generateProductRows();

    return (
      <div style={{ flex: 1, paddingTop: 5, paddingBottom: 5 }}>
        <PanelListCellComponent
          producerId={producerId}
          id={id}
          name={name}
          onPressDelete={onPressDelete}
          blind={blind}
          texture={texture}
          panelists={panelists}
          pin={pin}
          products={products}
          productRows={productRows}
          reviewsCount={reviewsCount}
          reviewDurationAggregateSeconds={reviewDurationAggregateSeconds}
          reviewDurationAverageSeconds={reviewDurationAverageSeconds}
          tags={tags}
          timeLimitSeconds={timeLimitSeconds}
          timeElapsedSeconds={timeElapsedSeconds}
          updateBlindLabel={updateBlindLabel}
          successUpdating={successUpdating}
          handleEndNow={this.handleEndNow}
          updating={updating}
          errorUpdating={errorUpdating}
          showExtendPanelTime={this.state.showExtendPanelTime}
          setShowExtendPanelTime={this.setShowExtendPanelTime}
          setNewPanelEndTime={this.setNewPanelEndTime}
          newPanelEndTime={newPanelEndTime}
          handleExtendPanel={this.extendPanel}
          endTime={endTime}
          startTime={startTime}
          colorCode={colorCode}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  viewerUserId: selectViewerUserId(state),
  updateBlindLabel: state.updateBlindLabel
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  graphql(UserNotificationsByPanelIdQuery, {
    options: ({ id }: Props) => ({
      variables: {
        panelId: id,
        notificationType: NOTIFICATION_TYPE_ENUM.COMPLETED_PANEL
      }
    }),
    name: 'userNotificationsByPanelId'
  })
)(PanelListCell);
