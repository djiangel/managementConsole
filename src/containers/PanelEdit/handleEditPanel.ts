import gql from 'graphql-tag';
import { Moment } from 'moment';
import history from 'constants/routerHistory';
import graphqlClient from 'consumers/graphqlClient';
import AvailablePanelsQuery from '@graphql/queries/AvailablePanels';
import workspaceProducerId from 'selectors/workspaceProducerId';
import store from 'constants/store';
import DeletePanelTag from '@graphql/mutations/DeletePanelTag';
import CreateTagMutation from '@graphql/mutations/CreateTag';
import CreatePanelTagMutation from '@graphql/mutations/CreatePanelTag';
import AllTagsQuery from '@graphql/queries/AllTagsQuery';
import ExpiredPanelsQuery from '../../graphql/queries/ExpiredPanels';
import PDFDownloadQuery from '../../graphql/queries/PDFDownloadQuery';
import ConchRequest from '../../graphql/queries/ConchRequest';
import OptimizationRequest from '../../graphql/queries/OptimizationRequest';
import { event, exception } from 'react-ga';
import { EDIT_PANEL, EDIT_PANEL_DELETE } from 'constants/googleAnalytics/actions';
import { CAT_EDIT_PANEL } from 'constants/googleAnalytics/categories';

const UPDATE_PANEL = gql`
  mutation UpdatePanel($panelId: Int!, $input: PanelPatch!) {
    updatePanelById(input: { id: $panelId, panelPatch: $input }) {
      panel {
        id
      }
    }
  }
`;

const UPDATE_PANEL_PRODUCT = gql`
  mutation UpdatePanelProduct(
    $panelProductId: Int!
    $input: PanelProductPatch!
  ) {
    updatePanelProductById(
      input: { id: $panelProductId, panelProductPatch: $input }
    ) {
      panelProduct {
        id
      }
    }
  }
`;

const DELETE_PANEL_PRODUCT = gql`
  mutation DeletePanelProduct($panelProductId: Int!) {
    deletePanelProductById(input: { id: $panelProductId }) {
      deletedPanelProductId
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

const SELECTED_PANEL_PRODUCT_QUESTION_BY_PANEL_PRODUCT_ID = gql`
  query SelectedPanelProductQuestionByPanelProductId($panelProductId: Int!) {
    selectedPanelProductQuestions: allSelectedPanelProductQuestions(
      condition: {
        panelProductId: $panelProductId
      }
    ) {
      nodes {
        id
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

const DELETE_SELECTED_PANEL_PRODUCT_QUESTION = gql`
  mutation DeleteSelectedPanelProductQuestion($id: Int!) {
    deleteSelectedPanelProductQuestionById(
      input: {
        id: $id
      }
    ) {
      selectedPanelProductQuestion {
        id
      }
    }
  }
`;

async function addPanelTag(panelTagId, panelId) {
  const panelTag = {
    panelId: parseInt(panelId),
    tagId: panelTagId
  };
  return graphqlClient.mutate({
    mutation: CreatePanelTagMutation,
    variables: {
      panelTag
    }
  });
}

interface StartPanelValues {
  products: any[];
  originalProducts: any[];
  startTime: Moment;
  endTime: Moment;
  blindPanel: boolean;
  hideReviews: boolean;
  blindLabels: any;
  servingVessels: any;
  clientNames: any;
  projectNames: any;
  totalCosts: any;
  public: boolean;
  texture: boolean;
  name: string;
  panelTags: any[];
  originalPanelTags: any[];
  behavioralQuestions: any;
  oldBehavioralQuestions: any;
}


export const handleTriggerReport = (conchRequestPayload) => {
  try {
    return graphqlClient.query({
      query: ConchRequest,
      variables: {
        input: conchRequestPayload
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export const handleOptimizationReport = (optimizationRequestPayload) => {
  try {
    return graphqlClient.query({
      query: OptimizationRequest,
      variables: {
        input: optimizationRequestPayload
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export const handleGoogleDownload = (pdfPath) => {
  try {
    return graphqlClient.query({
      query: PDFDownloadQuery,
      variables: {
        pdfName: pdfPath
      }
    });
  } catch (e) {
    console.error(e);
  }
};



export const handleDeletePanel = async (panelId, producerId) => {
  try {
    event({
      category: CAT_EDIT_PANEL,
      action: EDIT_PANEL_DELETE
    });

    // update panel metadata
    await graphqlClient.mutate({
      mutation: UPDATE_PANEL,
      variables: {
        panelId: parseInt(panelId),
        input: { visibility: false }
      },
      refetchQueries: [
        {
          query: ExpiredPanelsQuery,
          variables: {
            producerId,
            first: 3
          }
        },
        {
          query: AvailablePanelsQuery,
          variables: {
            producerId
          }
        }
      ]
    });
    history.push('/panels');
  } catch (e) {
    console.error(e);
    exception({
      description: `Panel Deletion Failed - ${e.message}`,
      fatal: false
    });
  }
};

export const handleEditPanel = async (
  panelId,
  producerId,
  values: StartPanelValues,
  actions
) => {
  event({
    category: CAT_EDIT_PANEL,
    action: EDIT_PANEL
  });

  const panelPatch = {
    name: values.name,
    blind: values.blindPanel,
    startTime: values.startTime.toISOString(),
    endTime: values.endTime.toISOString(),
    public: values.public,
    texture: values.texture
  };

  let inAFSWorkspace = false;
  if (producerId == 25) {
    inAFSWorkspace = true;
  }

  try {
    // update panel metadata
    await graphqlClient.mutate({
      mutation: UPDATE_PANEL,
      variables: {
        panelId: parseInt(panelId),
        input: panelPatch
      }
    });

    // remove any deleted products
    const removedProducts = values.originalProducts.filter(
      p =>
        values.products.find(a => a.panelProductId === p.panelProductId) ===
        undefined
    );
    for (let p in removedProducts) {
      const pp = removedProducts[p];

      if(values.oldBehavioralQuestions[pp.panelProductId]){
        const selectedPanelProductQuestionsResult = await graphqlClient.query({
          query: SELECTED_PANEL_PRODUCT_QUESTION_BY_PANEL_PRODUCT_ID,
          variables: {
            panelProductId: pp.panelProductId
          }
        });
        
        selectedPanelProductQuestionsResult.data.selectedPanelProductQuestions.nodes.map(async sppq =>
          await graphqlClient.mutate({
            mutation: DELETE_SELECTED_PANEL_PRODUCT_QUESTION,
            variables: {
              id: sppq.id
            }
          })
        );
      }

      await graphqlClient.mutate({
        mutation: DELETE_PANEL_PRODUCT,
        variables: {
          panelProductId: pp.panelProductId
        }
      });
    }
    // create any new panel products from products that were not in the original list
    const newProducts = values.products.filter(
      (p, idx) =>
        values.originalProducts.find(
          a => a.panelProductId === p.panelProductId
        ) === undefined
    );

    for (let idx in newProducts) {
      const pp = newProducts[idx];
      let order = values.products.indexOf(newProducts[idx]);

      const panelProductResult = await graphqlClient.mutate({
        mutation: CREATE_PANEL_PRODUCT,
        variables: {
          input: {
            panelId: parseInt(panelId),
            productId: parseInt(pp.id),
            order: order,
            blindLabel: values.blindPanel ? values.blindLabels[pp.id] : ''
          }
        }
      });

      if (values.behavioralQuestions[pp.id]) {
        const selectedProductQuestionsResult = await graphqlClient.query({
          query: SELECTED_PRODUCT_QUESTION_BY_PRODUCT_ID,
          variables: {
            productId: parseInt(pp.id)
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
    }

    // update panel product attributes
    const updatedProducts = values.originalProducts.filter(
      (p, idx) =>
        !!values.products.find(a => a.panelProductId === p.panelProductId)
    );

    updatedProducts.forEach(async function(item) {
      const pp = values.products.filter(a => a.productId === item.productId);
      let order = values.products.indexOf(pp[0]);

      let updatedInput = {
        attributes: pp[0].attributes,
        order: order,
        productId: pp[0].productId,
        panelId: parseInt(panelId),
        blindLabel: values.blindPanel
          ? values.blindLabels[pp[0].panelProductId || pp[0].productId]
          : '',
        servingVessel:
          values.servingVessels[pp[0].panelProductId || pp[0].productId],
        clientName: inAFSWorkspace
          ? values.clientNames[pp[0].panelProductId || pp[0].productId]
          : '',
        projectName: inAFSWorkspace
          ? values.projectNames[pp[0].panelProductId || pp[0].productId]
          : '',
        totalCost: inAFSWorkspace
          ? values.totalCosts[pp[0].panelProductId || pp[0].productId]
          : ''
      };

      await graphqlClient.mutate({
        mutation: UPDATE_PANEL_PRODUCT,
        variables: {
          panelProductId: pp[0].panelProductId,
          input: updatedInput
        }
      });

      if (values.oldBehavioralQuestions[pp[0].panelProductId] !== values.behavioralQuestions[pp[0].panelProductId]){
        if(values.behavioralQuestions[pp[0].panelProductId]){
            const selectedProductQuestionsResult = await graphqlClient.query({
              query: SELECTED_PRODUCT_QUESTION_BY_PRODUCT_ID,
              variables: {
                productId: parseInt(pp[0].productId)
              }
            });
    
            selectedProductQuestionsResult.data.selectedProductQuestions.nodes.map(async spq =>
              await graphqlClient.mutate({
                mutation: CREATE_SELECTED_PANEL_PRODUCT_QUESTION,
                variables: {
                  selectedPanelProductQuestion: {
                    questionId: spq.questionId,
                    panelProductId: pp[0].panelProductId
                  }
                }
              })
            );
        } else {
          const selectedPanelProductQuestionsResult = await graphqlClient.query({
            query: SELECTED_PANEL_PRODUCT_QUESTION_BY_PANEL_PRODUCT_ID,
            variables: {
              panelProductId: pp[0].panelProductId
            }
          });

          selectedPanelProductQuestionsResult.data.selectedPanelProductQuestions.nodes.map(async sppq =>
            await graphqlClient.mutate({
              mutation: DELETE_SELECTED_PANEL_PRODUCT_QUESTION,
              variables: {
                id: sppq.id
              }
            })
          );
        }
      }
      
    });

    // delete any removed panel tags
    const panelTagsToBeAdded = values.panelTags.filter(tag => {
      return values.originalPanelTags.findIndex(a => a.id === tag.id) === -1;
    });
    const panelTagsToBeDeleted = values.originalPanelTags.filter(tag => {
      return values.panelTags.findIndex(a => a.id === tag.id) === -1;
    });

    if (panelTagsToBeDeleted.length) {
      panelTagsToBeDeleted.map(async panelTag => {
        return await graphqlClient.mutate({
          mutation: DeletePanelTag,
          variables: {
            panelTagId: panelTag.panelTagId
          }
        });
      });
    }

    // add any new panel tags
    if (panelTagsToBeAdded.length) {
      const newPanelTags = panelTagsToBeAdded.filter(tag => isNaN(tag.id));
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

      const panelTagIds = panelTagsToBeAdded
        .filter(tag => !isNaN(tag.id))
        .map(tag => Number(tag.id));
      newPanelTagIds.map(res => res.then(id => addPanelTag(id, panelId)));

      panelTagIds.map(e => addPanelTag(e, panelId));
    }
    await graphqlClient.query({
      query: AvailablePanelsQuery,
      variables: { producerId },
      fetchPolicy: 'network-only'
    });

    actions.setSubmitting(false);
    history.push('/panels');
  } catch (e) {
    console.error(e);
    actions.setErrors({
      submission: 'There was an error updating the panel.'
    });
    actions.setSubmitting(false);
    
    exception({
      description: `Panel Update Failed - ${e.message}`,
      fatal: false
    });
  }
};
