import errorAction from '../actions/error';
import { MOVE_FOLDER } from '../actions/moveFolder';
import { MOVE_PRODUCT } from '../actions/moveProduct';
import { DELETE_FOLDER } from '../actions/deleteFolder';
import { FORM_SUBMIT } from '../actions/formSubmit';
import {
  ADD_FOLDER_FORM,
  EDIT_FOLDER_FORM,
  MOVE_PRODUCT_FORM
} from '../constants/formNames';
import { take, put, select, fork, call } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit } from 'redux-form';

import FoldersQuery from '../graphql/queries/FoldersQuery';
import ProductsQuery from '../graphql/queries/ProductsQuery';
import ProductByIdQuery from '../graphql/queries/ProductByIdQuery';
import AvailablePanelsQuery from '../graphql/queries/AvailablePanels';

import CreateFolder from '../graphql/mutations/CreateFolder';
import UpdateFolder from '../graphql/mutations/UpdateFolder';
import UpdateProduct from '../graphql/mutations/UpdateProduct';
import DeleteFolder from '../graphql/mutations/DeleteFolder';

import graphqlClient from '../consumers/graphqlClient';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';

function* editFolderLocationSaga() {
  while (true) {
    let { payload } = yield take(({ type }) => type === MOVE_FOLDER);
    let { draggedId, draggedOverId } = payload;

    const folderPatch = {
      parentId: draggedOverId
    };

    const workspaceId = yield select(selectWorkspaceProducerId);

    try {
      yield graphqlClient.mutate({
        mutation: UpdateFolder,
        variables: {
          id: draggedId,
          folderPatch
        },
        refetchQueries: folderQueriesToRefetch(workspaceId)
      });
    } catch (error) {
      yield put(
        errorAction({
          error,
          title: 'Failed to move folder',
          description: error.message
        })
      );
    }
  }
}

function* addFolderSaga() {
  while (true) {
    yield take(
      ({ type, payload }) => type === FORM_SUBMIT && payload === ADD_FOLDER_FORM
    );

    yield put(startSubmit(ADD_FOLDER_FORM));

    const addFolderFormValues = yield select(getFormValues(ADD_FOLDER_FORM));
    const producerId = yield select(selectWorkspaceProducerId);

    const folder = {
      producerId: producerId,
      name: addFolderFormValues.name,
      parentId: addFolderFormValues.parentId
    };

    try {
      yield graphqlClient.mutate({
        mutation: CreateFolder,
        variables: {
          folder
        },
        refetchQueries: folderQueriesToRefetch(producerId)
      });

      yield put(stopSubmit(ADD_FOLDER_FORM));
    } catch (error) {
      yield put(stopSubmit(ADD_FOLDER_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to add folder',
          description: error.message
        })
      );
    }
  }
}

function* editFolderSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === EDIT_FOLDER_FORM
    );

    yield put(startSubmit(EDIT_FOLDER_FORM));

    const editFolderFormValues = yield select(getFormValues(EDIT_FOLDER_FORM));
    const producerId = yield select(selectWorkspaceProducerId);

    const folderPatch = {
      name: editFolderFormValues.name
    };

    try {
      yield graphqlClient.mutate({
        mutation: UpdateFolder,
        variables: {
          id: editFolderFormValues.id,
          folderPatch
        },
        refetchQueries: folderQueriesToRefetch(producerId)
      });

      yield put(stopSubmit(EDIT_FOLDER_FORM));
    } catch (error) {
      yield put(stopSubmit(EDIT_FOLDER_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to edit folder',
          description: error.message
        })
      );
    }
  }
}

function* moveProduct(id, destinationFolderId, workspaceId) {
  const productPatch = {
    folderId: destinationFolderId
  };

  try {
    yield graphqlClient.mutate({
      mutation: UpdateProduct,
      variables: {
        id,
        productPatch
      },
      refetchQueries: productQueriesToRefetch(workspaceId, id)
    });
  } catch (error) {
    yield put(
      errorAction({
        error,
        title: 'Failed to move product',
        description: error.message
      })
    );
    return error;
  }
}

function* deleteSubfolderSaga(
  folderTree,
  products,
  id,
  workspaceId,
  destinationFolderId
) {
  if (products) {
    const toMove = products.filter(product => product.folderId === id);
    yield toMove.map(product =>
      call(moveProduct, product.id, destinationFolderId, workspaceId)
    );
  }
  yield folderTree[id].children.map(folder =>
    fork(
      deleteSubfolderSaga,
      folderTree,
      products,
      folder,
      workspaceId,
      destinationFolderId
    )
  );
  yield graphqlClient.mutate({
    mutation: DeleteFolder,
    variables: {
      id
    },
    refetchQueries: folderQueriesToRefetch(workspaceId)
  });
}

function* deleteFolderSaga() {
  while (true) {
    let { payload } = yield take(({ type }) => type === DELETE_FOLDER);
    let { folderTree, products, id } = payload;

    const workspaceId = yield select(selectWorkspaceProducerId);

    yield fork(
      deleteSubfolderSaga,
      folderTree,
      products,
      id,
      workspaceId,
      folderTree[id].parentId
    );
  }
}

function* addProductToFolderSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === MOVE_PRODUCT_FORM
    );

    yield put(startSubmit(MOVE_PRODUCT_FORM));

    const moveProductFormValues = yield select(
      getFormValues(MOVE_PRODUCT_FORM)
    );
    const producerId = yield select(selectWorkspaceProducerId);

    let error = yield call(
      moveProduct,
      moveProductFormValues.productId,
      moveProductFormValues.folder,
      producerId
    );
    if (error) {
      yield put(stopSubmit(MOVE_PRODUCT_FORM, error));
    } else {
      yield put(stopSubmit(MOVE_PRODUCT_FORM));
    }
  }
}

function* editProductLocationSaga() {
  while (true) {
    let { payload } = yield take(({ type }) => type === MOVE_PRODUCT);
    let { productDraggedId, draggedOverId } = payload;

    const workspaceId = yield select(selectWorkspaceProducerId);

    yield call(moveProduct, productDraggedId, draggedOverId, workspaceId);
  }
}

const folderQueriesToRefetch = producerId => [
  {
    query: FoldersQuery,
    variables: {
      condition: {
        producerId: producerId
      }
    }
  }
];

const productQueriesToRefetch = (producerId, productId) => [
  {
    query: ProductsQuery,
    variables: {
      first: 25,
      condition: {
        producerId: producerId,
        visibility: true
      }
    }
  },
  {
    query: ProductByIdQuery,
    variables: {
      id: productId
    }
  },
  {
    query: AvailablePanelsQuery,
    variables: {
      producerId: producerId
    }
  }
];

const sagas = [
  editProductLocationSaga,
  editFolderLocationSaga,
  addProductToFolderSaga,
  addFolderSaga,
  editFolderSaga,
  deleteFolderSaga
];

export default sagas;
