import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import store from './constants/store';
import graphqlClient from './consumers/graphqlClient';
import AppRootContainer from './containers/AppRoot';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiTheme } from './styles/theme';

const RootElement = () => (
  <ApolloProvider client={graphqlClient}>
    <ApolloHooksProvider client={graphqlClient}>
      <Provider store={store}>
        <MuiThemeProvider theme={MuiTheme}>
          <AppRootContainer />
        </MuiThemeProvider>
      </Provider>
    </ApolloHooksProvider>
  </ApolloProvider>
);

export default hot(RootElement);
