import React, { Component } from 'react';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import AttributesMapTableContainer from '../../containers/AttributesMapTable';
import ActivityIndicator from '../../components/ActivityIndicator';
import LayoutMetricsGroup from '../../components/LayoutMetricsGroup';
import LayoutSectionHeader from '../../components/LayoutSectionHeader';
import Metric from '../../components/Metric';

const dateFormat = 'MMM dd, yyyy';

type Props = {
  batchStates: Object,
  loading: boolean,
  match: Object
};

export default class BatchContainer extends Component {
  props: Props;

  render() {
    const {
      batchStates,
      loading,
      match: { params }
    } = this.props;

    if (loading) {
      return <ActivityIndicator />;
    }

    const batchIdentifier = params && params.batchSlug;
    const batchStateNodes = batchStates.nodes;

    return (
      <div>
        <LayoutSectionHeader>
          <h1>{batchIdentifier}</h1>
        </LayoutSectionHeader>
        <LayoutMetricsGroup>
          <Metric status="neutral" title="Batch States">
            <h1>{batchStates.totalCount || 'none'}</h1>
          </Metric>
        </LayoutMetricsGroup>
        <LayoutSectionHeader>
          <h2>Batch States</h2>
        </LayoutSectionHeader>
        {batchStateNodes.map(batchState => [
          <LayoutSectionHeader key={`${batchState.id}Header`}>
            <h2>{batchState.id}</h2>
            <h3>
              Created on{' '}
              {formatDate(parseISO(batchState.createdAt), dateFormat)} and last
              updated on{' '}
              {formatDate(parseISO(batchState.updatedAt), dateFormat)}.
            </h3>
          </LayoutSectionHeader>,
          <LayoutMetricsGroup key={`${batchState.id}Metrics`}>
            <Metric status="neutral" title="Batch Flaw Detection Reports">
              <h1>
                {batchState.reportBatchFlawDetections.totalCount || 'none'}
              </h1>
            </Metric>
            <Metric status="neutral" title="Objective Flavor Profile Reports">
              <h1>
                {batchState.reportObjectiveFlavorProfiles.totalCount || 'none'}
              </h1>
            </Metric>
            <Metric status="neutral" title="Batch Deviation Detection Reports">
              <h1>
                {batchState.reportBatchDeviationDetections.totalCount || 'none'}
              </h1>
            </Metric>
            <Metric
              status="neutral"
              title="Flavor Attribute Intensities Reports"
            >
              <h1>
                {batchState.reportFlavorAttributeIntensities.totalCount ||
                  'none'}
              </h1>
            </Metric>
            <Metric
              status="neutral"
              title="Product Reference Flavor Effect Reports"
            >
              <h1>
                {batchState.reportProductReferenceFlavorEffects.totalCount ||
                  'none'}
              </h1>
            </Metric>
            <Metric
              status="neutral"
              title="Product Reference Flavor Intensity Effect Reports"
            >
              <h1>
                {batchState.reportProductReferenceFlavorIntensityEffects
                  .totalCount || 'none'}
              </h1>
            </Metric>
            <Metric
              status="neutral"
              title="Flavor Attribute Intensity Deviation Detection Reports"
            >
              <h1>
                {batchState.reportFlavorAttributeIntensityDeviationDetections
                  .totalCount || 'none'}
              </h1>
            </Metric>
          </LayoutMetricsGroup>,
          <AttributesMapTableContainer
            attributesMap={{
              notes: batchState.notes,
              productName: batchState.product && batchState.product.name
            }}
            key={`${batchState.id}PropertiesTable`}
          />,
          <LayoutSectionHeader key={`${batchState.id}AttributesHeader`}>
            <h2>Attributes</h2>
          </LayoutSectionHeader>,
          <AttributesMapTableContainer
            attributesMap={batchState.attributes}
            key={`${batchState.id}AttributesTable`}
          />
        ])}
      </div>
    );
  }
}
