import 'react-hot-loader';
/* global document, Raven */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './i18n';

import RootElement from './root';

import './index.css';
import { initialize } from 'react-ga';
import { TRACKING_ID } from './constants/googleAnalytics';

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://120eeda110744570b28b98e085d32acc@sentry.io/1230000'
  ).install();
}

initialize(TRACKING_ID, {
  debug: process.env.NODE_ENV !== 'production',
  titleCase: false
});

const render = Component => {
  ReactDOM.render(<Component />, document.getElementById('root'));
};

render(RootElement);

if (module.hot) {
  module.hot.accept();
}
