/* global window */
import getStore from '../store';

const initialState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const store = getStore(initialState);

window.store = store;

export default store;
