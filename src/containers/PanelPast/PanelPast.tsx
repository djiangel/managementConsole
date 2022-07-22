import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from 'recompose';
import { connect } from 'react-redux';
import { utc } from 'moment';
import { withTranslation } from 'react-i18next';
import { get } from 'lodash';
import PanelList from '../PanelList';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import ExpiredPanelsQuery from '../../graphql/queries/ExpiredPanels';
import PanelListCell from 'components/PanelListCell';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  updateBlindLabel: state.updateBlindLabel
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  withProps(() => ({
    pastPanels: true
  })),
  graphql(ExpiredPanelsQuery, {
    options: ({ producerId }: any) => ({
      variables: {
        producerId,
        first: 3
      }
    }),
    props: ({ data: { loading, producer, fetchMore } }: any) => {
      return {
        fetchMore,
        loading,
        pageInfo: producer && producer.panels && producer.panels.pageInfo,
        panels: producer && producer.panels && producer.panels.nodes,
        renderPanel: panel => {
          const endTime = utc(panel && panel.endTime);
          const startTime = utc(panel && panel.startTime);
          const now = utc();

          // Obtain color code for each panel
          const panelColorCode = () => {
            const products = panel.products.nodes;
            const minDataRequiredArray = products.map(product => {
              const reviews = product.productReviews.nodes;
              const reviewCount = product.productReviews.totalCount;
              let poorReviewCount = 0;

              reviews.forEach(({ dataQuality }) => {
                if(dataQuality){
                  const {
                    allGgVar,
                    ggVarMax,
                    insufficientGgVar,
                    noRefFlavor,
                    excessiveRefFlavor,
                    shortReviewTime,
                    buttonMashing
                  } = dataQuality;
                  if (
                    allGgVar ||
                    ggVarMax ||
                    insufficientGgVar ||
                    noRefFlavor ||
                    excessiveRefFlavor ||
                    shortReviewTime ||
                    buttonMashing
                  ) {
                    poorReviewCount++;
                  }
                }
              });

              const cleanReview = reviewCount - poorReviewCount;

              // Clean reviews need to be more than the minimum of review count or 10 for product to qualify
              return cleanReview >= Math.min(reviewCount, 10);
            });
            const qualifiedProductsCount = minDataRequiredArray.filter(Boolean)
              .length;
            const qualifiedProductsPercentage =
              qualifiedProductsCount / products.length;

            return qualifiedProductsPercentage == 1 ? 'green' : 'red'
          };

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
              colorCode={panelColorCode()}
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
                  totalCost: productNode.totalCost
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
