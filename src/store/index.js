/* global window */
import { includes } from 'lodash';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import errorAction from '../actions/error';
import { persistentReducer, persistenceMiddleware, load } from './persistence';
import analyticsBlacklistedActionChecks from '../constants/analyticsBlacklistedActionChecks';
import analyticsSensitiveActionChecks from '../constants/analyticsSensitiveActionChecks';
import routerHistory from '../constants/routerHistory';
import graphqlClient from '../consumers/graphqlClient';
import rootSaga from '../sagas';

export default function getStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle, max-len
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistentReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        persistenceMiddleware,
        sagaMiddleware,
        routerMiddleware(routerHistory)
      )
    )
  );

  // Run root saga via sagaMiddleware
  // NOTE: This must be done after the saga middleware is mounted on the store
  // via applyMiddleware.
  sagaMiddleware.run(rootSaga);

  // Load previous store state from persistence
  load(store).catch(error =>
    store.dispatch(
      errorAction({
        error,
        title: 'Failed to load persisted state.'
      })
    )
  );

  return store;
}
