import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { utc } from 'moment';
import { withTranslation } from 'react-i18next';
import { get } from 'lodash';
import PanelList from '../PanelList';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import AvailablePanelsQuery from '../../graphql/queries/AvailablePanels';
import PanelListCell from 'components/PanelListCell';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  updateBlindLabel: state.updateBlindLabel
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  graphql(AvailablePanelsQuery, {
    options: ({ producerId }: any) => ({
      variables: {
        producerId
      }
    }),
    props: ({ data: { loading, producer } }: any) => {
      return {
        loading,
        panels: producer && producer.panels && producer.panels.nodes,
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
                  name: get(productNode, 'product.name', 'Unknown product'),
                  attributes: productNode.attributes,
                  reviews: productNode.productReviews.totalCount,
                  id: productNode.id,
                  blindLabel: productNode.blindLabel,
                  // prototype: get(productNode, 'product.prototype', false),
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
              reviewDurationAggregateSeconds={panel.totalReviewDurationSeconds}
              reviewDurationAverageSeconds={panel.averageReviewDurationSeconds}
              tags={panel.tags && panel.tags.nodes && panel.tags.nodes}
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
)(PanelList);
