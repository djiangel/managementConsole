import { startSubmit, stopSubmit } from 'redux-form';
import { put } from 'redux-saga/effects';
import graphqlClient from '../consumers/graphqlClient';
import gql from 'graphql-tag';
import UpdateBlindLabel from '../graphql/mutations/UpdateBlindLabel';

export default function* updatePanelSettingsSaga(action) {
  // Only run for panel settings submit
  console.log(/^panel-\d+-settings/.test(action.payload));
  if (!/^panel-\d+-settings/.test(action.payload)) {
    return;
  }

  const panelId = action.payload.split('-')[1];
  yield put(startSubmit(action.payload));

  const panelProductsById = gql`
    query PanelProductsById($panelId: Int!) {
      panel: panelById(id: $panelId) {
        products: panelProductsByPanelId(orderBy: ORDER_ASC) {
          nodes {
            id
            blindLabel
          }
        }
      }
    }
  `;

  const products = yield graphqlClient.query({
    query: panelProductsById,
    variables: {
      panelId
    }
  });

  yield put({ type: 'UPDATE_BLIND_LABEL', payload: { panelId } });

  try {
    products.data.panel.products.nodes.forEach(function*(p) {
      yield graphqlClient.mutate({
        mutation: UpdateBlindLabel,
        variables: {
          input: {
            id: p.id,
            panelProductPatch: {
              id: p.id,
              blindLabel: document.getElementById(
                `panel-${action.payload.id}-product-${p.id}-label`
              ).value
            }
          }
        }
      });
    });
  } catch (e) {
    yield put({
      type: 'UPDATE_BLIND_LABEL_FAILED',
      payload: {
        panelId
      }
    });
  }

  yield put({
    type: 'UPDATE_BLIND_LABEL_SUCCESS',
    payload: {
      panelId
    }
  });

  yield put(stopSubmit(action.payload));
}
