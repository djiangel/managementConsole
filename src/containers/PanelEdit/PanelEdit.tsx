import * as React from 'react';
import * as moment from 'moment';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { upperFirst } from 'lodash';
import ProducerByIdQuery from '../../graphql/queries/ProducerByIdQuery';
import PanelCreateForm from 'containers/PanelCreate/PanelCreateForm';
import PanelQuery from '@graphql/queries/Panel';
import { useQuery } from 'react-apollo-hooks';
import AllTagsQuery from '@graphql/queries/AllTagsQuery';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { handleEditPanel, handleDeletePanel } from './handleEditPanel';
import { validatePanelForm } from 'containers/PanelCreate/validatePanelForm';
import { useTranslation } from 'react-i18next';

const PanelEdit = ({
  workspaceId,
  panelTagResults,
  producer,
  match: {
    params: { panelId }
  },
  loading,
  panel
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <div />;
  }

  const transformedProducts =
    panel &&
    panel.products &&
    panel.products.nodes &&
    panel.products.nodes.map(p => ({
      productId: p.product.id,
      panelProductId: p.id,
      ...p.product,
      ...p
    }));

  const transformedTags =
    panel &&
    panel.tags &&
    panel.tags.nodes &&
    panel.tags.nodes.map(e => ({
      label: e.tag.tag.toLowerCase(),
      id: e.tag.id + '',
      panelTagId: e.id
    }));

  const blindLabels = {};
  const servingVessels = {};
  const clientNames = {};
  const projectNames = {};
  const totalCosts = {};
  const expirationDates = {};
  const productionDates = {};
  const behavioralQuestions = {};

  const name = panel ? panel.name : null;
  const startTime = panel ? panel.startTime : null;
  const endTime = panel ? panel.endTime : null;
  const blind = panel ? panel.blind : null;
  const texture = panel ? panel.texture : null;
  const hideReviews = panel ? panel.hideReviews : null;
  const publicProd = panel ? panel.public : null;

  for (let idx in transformedProducts) {
    const p = transformedProducts[idx];
    blindLabels[p.panelProductId] = p.blindLabel;
    behavioralQuestions[p.panelProductId] =
      p.selectedPanelProductQuestions.totalCount > 0;
    servingVessels[p.panelProductId] = p.servingVessel;
    clientNames[p.panelProductId] = p.clientName;
    projectNames[p.panelProductId] = p.projectName;
    totalCosts[p.panelProductId] = p.totalCost;
  }

  return (
    <div
      style={{ marginRight: '1rem', marginBottom: '4rem', maxWidth: '100%' }}
    >
      <h1>{t('panel.editPanel')}</h1>
      <Formik
        initialValues={{
          name: name,
          products: transformedProducts,
          originalProducts: transformedProducts,
          startTime: moment.utc(startTime).local(),
          endTime: moment.utc(endTime).local(),
          blindPanel: blind,
          texture: texture,
          hideReviews: hideReviews,
          originalPanelTags: transformedTags,
          panelTags: transformedTags,
          public: publicProd,
          productSearch: '',
          blindLabels: blindLabels,
          servingVessels: servingVessels,
          behavioralQuestions: behavioralQuestions,
          oldBehavioralQuestions: behavioralQuestions,
          clientNames: clientNames,
          projectNames: projectNames,
          totalCosts: totalCosts,
          expirationDates: expirationDates,
          productionDates: productionDates,
          showConfirmation: false
        }}
        validate={validatePanelForm}
        validateOnBlur={true}
        onSubmit={(values, actions) =>
          handleEditPanel(panelId, workspaceId, values, actions)
        }
        render={props => (
          <PanelCreateForm
            {...props}
            isEditPanel
            handleDeletePanel={() => handleDeletePanel(panelId, workspaceId)}
            producerId={workspaceId}
            panelTagResults={panelTagResults}
            editing={true}
            allowBehavioralQuestions={
              producer.producer && producer.producer.allowBehavioralQuestions
            }
          />
        )}
      />
    </div>
  );
};

interface Props {
  workspaceId: any;
}

const mapStateToProps = state => ({
  workspaceId: selectWorkspaceProducerId(state)
});

export default compose(
  connect(mapStateToProps),
  graphql(ProducerByIdQuery, {
    name: 'producer',
    options: (props: Props) => ({
      variables: {
        id: props.workspaceId
      }
    })
  }),
  graphql(AllTagsQuery, {
    name: 'panelTagResults',
    options: (props: Props) => ({
      variables: {
        condition: {
          producerId: props.workspaceId
        }
      }
    })
  }),
  graphql(PanelQuery, {
    options: ({
      match: {
        params: { panelId }
      }
    }: any) => ({
      variables: {
        panelId: Number(panelId)
      },
      fetchPolicy: 'no-cache'
    }),
    props: (props: any) => {
      const {
        data: { loading, panel }
      } = props;
      return {
        loading,
        panel
      };
    }
  })
)(PanelEdit);
