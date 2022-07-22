import { select, take, call } from 'redux-saga/effects';

import selectWorkspaceProducerId from '../selectors/workspaceProducerId';

import { ADD_DEFAULT_PROD_CLASS } from '../actions/addDefaultProductClass';
import defaultClasses from '../constants/defaultClasses';

import graphqlClient from '../consumers/graphqlClient';
import AllProductClassesQuery from '../graphql/queries/AllProductClassesQuery';
import CreateProductClass from '../graphql/mutations/CreateProductClass';

function* addProductClass(name, workspaceId) {
  const productClass = {
    producerId: workspaceId,
    name
  };
  try {
    yield graphqlClient.mutate({
      mutation: CreateProductClass,
      variables: {
        productClass
      },
      refetchQueries: productClassRefetchQueries(workspaceId)
    });
  } catch (error) {
    errorAction({
      error,
      title: 'Failed to load default product class ' + name,
      description: error.message
    });
  }
}

function* createDefaultProductClasses() {
  while (true) {
    yield take(({ type }) => type === ADD_DEFAULT_PROD_CLASS);

    const workspaceId = yield select(selectWorkspaceProducerId);

    //Query existing tags
    const allClasses = yield graphqlClient.query({
      query: AllProductClassesQuery,
      variables: {
        condition: {
          producerId: workspaceId
        }
      }
    });

    const allClassNames = allClasses.data.productClasses.nodes.map(e =>
      e.name.toLowerCase()
    );
    const missingTags = defaultClasses.filter(
      e => allClassNames.indexOf(e.toLowerCase()) === -1
    );

    yield missingTags.map(e => call(addProductClass, e, workspaceId));
  }
}

const productClassRefetchQueries = producerId => [
  {
    query: AllProductClassesQuery,
    variables: {
      condition: {
        producerId
      }
    }
  }
];

export default createDefaultProductClasses;
