import { call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { EDIT_REVIEW_FORM } from '../constants/formNames';
import appToastAdd from '../actions/appToastAdd';
import graphqlClient from '../consumers/graphqlClient';
import UpdateProductReview from '../graphql/mutations/UpdateProductReview';
import PanelByPinQuery from '../graphql/queries/PanelByPinQuery';

const getPanelByPin = pin => {
  return graphqlClient
    .query({
      query: PanelByPinQuery,
      variables: {
        pin: pin
      }
    })
    .then(result => {
      if (result.data.panels.totalCount !== 1) {
        throw new Error(`Panel with PIN ${pin} not found or not unique`);
      }

      return result;
    });
};

export default function* mergeAccountFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === EDIT_REVIEW_FORM
    );

    yield put(startSubmit(EDIT_REVIEW_FORM));

    const editReviewFormValues = yield select(getFormValues(EDIT_REVIEW_FORM));

    console.log(editReviewFormValues);

    try {
      const patch = {};

      // Changing product
      if (editReviewFormValues.product) {
        patch.productId = editReviewFormValues.product.value;

        // Replace PanelProductId
        if (editReviewFormValues.review.panelProduct) {
          const panelProductsQuery = yield graphqlClient.query({
            query: PanelProductQuery,
            variables: {
              panelId: editReviewFormValues.review.panelId,
              productId: editReviewFormValues.product.value
            }
          });

          console.log(panelProductsQuery);

          // Found replacement panel product
          // Panel product in the same panel and wanted product
          if (panelProductsQuery.data.totalCount === 1) {
            let newPanelProductId =
              panelProductsQuery.data.panelProducts.nodes[0].id;
            patch.panelProductId = newPanelProductId;
            yield put(
              appToastAdd({
                durationMilliseconds: 4000,
                message: `Updating Panel Product ID to ${newPanelProductId}`,
                title: 'Edit Review',
                toastKey: `toast_${Date.now()}`
              })
            );
            // No panel product for the wanted product in the same panel.
          } else if (panelProductsQuery.data.totalCount === 0) {
            yield put(
              appToastAdd({
                durationMilliseconds: 4000,
                message: `There is no panel products for product ${
                  patch.productId
                } within the same panel. You need to replace it manually.`,
                title: 'Edit Review',
                toastKey: `toast_${Date.now()}`
              })
            );
          }
        }
      } else if (editReviewFormValues.user) {
        // Changing User
        patch.userId = editReviewFormValues.user.value;
      } else if (editReviewFormValues.panelPin) {
        // Changing Panel
        // Load Panel
        const panel = yield getPanelByPin(editReviewFormValues.panelPin);
        let panelNode = panel.data.panels.nodes[0];
        patch.panelId = panelNode.id;

        yield put(
          appToastAdd({
            durationMilliseconds: 4000,
            message: `Replacing panel with panel ${panelNode.id} - ${
              panelNode.pin
            } - ${panelNode.name}`,
            title: 'Edit Review',
            toastKey: `toast_${Date.now()}`
          })
        );
      } else if (editReviewFormValues.panelProduct) {
        // Changing Blind Label
        patch.panelProductId = editReviewFormValues.panelProduct.value.id;
        patch.productId = editReviewFormValues.panelProduct.value.productId;
      } else if (editReviewFormValues.perceivedQuality) {
        patch.perceivedQuality =
          !isNaN(editReviewFormValues.perceivedQuality) &&
          Number(editReviewFormValues.perceivedQuality);
      }

      const reviewsQuery = yield graphqlClient.mutate({
        mutation: UpdateProductReview,
        variables: {
          id: editReviewFormValues.review.id,
          productReviewPatch: patch
        },
        refetchQueries: ['ProductReviewsQuery']
      });

      console.log(reviewsQuery);

      yield put(
        appToastAdd({
          durationMilliseconds: 4000,
          message: `Edit Review ${reviewsQuery.data.updated.productReview.id}`,
          title: 'Edit Review',
          toastKey: `toast_${Date.now()}`
        })
      );

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(EDIT_REVIEW_FORM));

      // Destroy the form so that it is re-rendered after the below route change
      yield put(destroy(EDIT_REVIEW_FORM));
    } catch (error) {
      yield put(stopSubmit(EDIT_REVIEW_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Edit Review',
          description: error.message
        })
      );
    }
  }
}
