import gql from 'graphql-tag';
import { Moment } from 'moment';

import store from 'constants/store';
import history from 'constants/routerHistory';
import graphqlClient from 'consumers/graphqlClient';
import workspaceProducerId from 'selectors/workspaceProducerId';
import viewerUserId from 'selectors/viewerUserId';
import AllTagsQuery from '../../graphql/queries/AllTagsQuery';
import CreateTagMutation from '../../graphql/mutations/CreateTag';
import CreatePanelTagMutation from '../../graphql/mutations/CreatePanelTag';
import { event, exception } from 'react-ga';
import { CAT_CREATE_PANEL } from 'constants/googleAnalytics/categories';
import { CREATE_PANEL as CREATE_PANEL_ACT } from 'constants/googleAnalytics/actions';

const CREATE_PANEL = gql`
  mutation CreatePanel($input: PanelInput!) {
    createPanel(input: { panel: $input }) {
      panel {
        id
      }
    }
  }
`;

const CREATE_PANEL_PRODUCT = gql`
  mutation CreatePanelProduct($input: PanelProductInput!) {
    createPanelProduct(input: { panelProduct: $input }) {
      panelProduct {
        id
      }
    }
  }
`;

const SELECTED_PRODUCT_QUESTION_BY_PRODUCT_ID = gql`
  query SelectedProductQuestionByProductId($productId: Int!) {
    selectedProductQuestions: allSelectedProductQuestions(
      condition: {
        productId: $productId
      }
    ) {
      nodes {
        questionId
      }
    }
  }
`;

const CREATE_SELECTED_PANEL_PRODUCT_QUESTION = gql`
  mutation CreateSelectedPanelProductQuestion($selectedPanelProductQuestion: SelectedPanelProductQuestionInput!) {
    createSelectedPanelProductQuestion(
      input: {
        selectedPanelProductQuestion: $selectedPanelProductQuestion
      }
    ) {
      selectedPanelProductQuestion {
        id
      }
    }
  }
`;

interface StartPanelValues {
  products: any[];
  startTime: Moment;
  endTime: Moment;
  blindPanel: boolean;
  afsWorkspaceBool: boolean;
  hideReviews: boolean;
  blindLabels: any;
  public: boolean;
  texture: boolean;
  name: string;
  panelTags: any[];
  servingVessels: any;
  clientNames: any;
  projectNames: any;
  totalCosts: any;
  productionDates: any;
  expirationDates: any;
  behavioralQuestions: Record<string, boolean>;
}

async function addPanelTag(panelTagId, panelId) {
  const panelTag = {
    panelId,
    tagId: panelTagId
  };
  return graphqlClient.mutate({
    mutation: CreatePanelTagMutation,
    variables: {
      panelTag
    }
  });
}

export const handleStartPanel = async (values: StartPanelValues, actions) => {
  const producerId = workspaceProducerId(store.getState());

  event({
    category: CAT_CREATE_PANEL,
    action: CREATE_PANEL
  });

  // Craft the shape of the CreatePanelInput
  const panelInput = {
    userId: viewerUserId(store.getState()),
    producerId,
    name: values.name,
    blind: values.blindPanel,
    texture: values.texture,
    startTime: values.startTime.toISOString(),
    endTime: values.endTime.toISOString(),
    public: values.public,
    hideReviews: values.hideReviews,
  };

  try {
    const createPanelResult = await graphqlClient.mutate({
      mutation: CREATE_PANEL,
      variables: {
        input: panelInput
      }
    });

    const panelId = createPanelResult.data.createPanel.panel.id;

    // Map over the panel product list and add each to the panel
    values.products.forEach(async (pp, idx) => {
      const panelProductResult = await graphqlClient.mutate({
        mutation: CREATE_PANEL_PRODUCT,
        variables: {
          input: {
            panelId,
            productId: pp.id,
            order: idx,
            blindLabel: values.blindPanel ? values.blindLabels[pp.id] : '',
            servingVessel: values.servingVessels[pp.id],
            clientName: values.afsWorkspaceBool ? values.clientNames[pp.id] : '',
            projectName: values.afsWorkspaceBool ? values.projectNames[pp.id] : '',
            totalCost: values.afsWorkspaceBool ? values.totalCosts[pp.id] : '',
            productionDate: values.afsWorkspaceBool ? values.productionDates[pp.id] : null,
            expirationDate: values.afsWorkspaceBool ? values.expirationDates[pp.id] : null
          }
        },
        refetchQueries: ['AvailablePanelsQuery']
      });

      if (values.behavioralQuestions[pp.id]) {
        const selectedProductQuestionsResult = await graphqlClient.query({
          query: SELECTED_PRODUCT_QUESTION_BY_PRODUCT_ID,
          variables: {
            productId: pp.id
          }
        });

        selectedProductQuestionsResult.data.selectedProductQuestions.nodes.map(async spq =>
          await graphqlClient.mutate({
            mutation: CREATE_SELECTED_PANEL_PRODUCT_QUESTION,
            variables: {
              selectedPanelProductQuestion: {
                questionId: spq.questionId,
                panelProductId: panelProductResult.data.createPanelProduct.panelProduct.id
              }
            }
          })
        );
      }
    });

    // Map over panel tags and add each to the panel
    const panelTags = values.panelTags;
    if (panelTags) {
      const newPanelTags = panelTags.filter(tag => isNaN(tag.id));
      const addNewPanelTagResults = newPanelTags.map(async newTag => {
        const tag = {
          tag: newTag.id,
          producerId
        };

        return await graphqlClient.mutate({
          mutation: CreateTagMutation,
          variables: {
            tag
          },
          refetchQueries: [
            {
              query: AllTagsQuery,
              variables: {
                condition: {
                  producerId
                }
              }
            }
          ]
        });
      });

      const newPanelTagIds =
        addNewPanelTagResults &&
        addNewPanelTagResults.map(res =>
          res.then(result => result.data.createTag.tag.id)
        );

      const panelTagIds = panelTags
        .filter(tag => !isNaN(tag.id))
        .map(tag => Number(tag.id));
      newPanelTagIds.map(res => res.then(id => addPanelTag(id, panelId)));

      panelTagIds.map(e => addPanelTag(e, panelId));
    }

    actions.setSubmitting(false);
    history.push('/panels');
  } catch (e) {
    console.error(e);
    actions.setErrors({
      submission: 'There was an error creating the panel.'
    });
    actions.setSubmitting(false);
    
    exception({
      description: `Panel Creation Failed - ${e.message}`,
      fatal: false
    });
  }
};
