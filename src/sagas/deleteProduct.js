import gql from 'graphql-tag';
import graphqlClient from '../consumers/graphqlClient';
import { select, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import ProductsQuery from '../graphql/queries/ProductsQuery';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import UpdateProductMutation from '../graphql/mutations/UpdateProduct';

// Keeping this here in the event that we're doing a hard-delete in future
const DeleteProductMutation = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProductById(input: { id: $id }) {
      deletedProductId
    }
  }
`;

export default function* deleteProductSaga(action) {
  const workspaceProducerId = yield select(selectWorkspaceProducerId);

  try {
    yield graphqlClient.mutate({
      mutation: UpdateProductMutation,
      variables: {
        id: action.payload,
        productPatch: {
          visibility: false
        }
      },
      refetchQueries: [
        {
          query: ProductsQuery,
          variables: {
            first: 25,
            condition: {
              producerId: workspaceProducerId,
              visibility: true
            }
          }
        }
      ]
    });

    yield put(push('/products'));
  } catch (e) {
    console.log(e);
  }
}
