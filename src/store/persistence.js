import * as storage from 'redux-storage';
import createLocalStorageEngine from 'redux-storage-engine-localstorage';
import debounceStorageDecorator from 'redux-storage-decorator-debounce';
import filterStorageDecorator from 'redux-storage-decorator-filter';
import rootReducer from '../reducers';

// (Key in localstorage to persist to)
const persistenceKey = 'ManagementConsole';

// (State keys that may be persisted)
const storageFilterWhitelistedKeys = ['session', 'workspaceProducerId'];

const storageEngine = debounceStorageDecorator(
  filterStorageDecorator(
    createLocalStorageEngine(persistenceKey),
    storageFilterWhitelistedKeys
  ),
  1000
);

export const persistenceMiddleware = storage.createMiddleware(storageEngine);
export const persistentReducer = storage.reducer(rootReducer);
export const load = storage.createLoader(storageEngine);
