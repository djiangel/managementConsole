import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';

import errorAction from '../actions/error';
import sessionClearAction from '../actions/sessionClear';
import store from '../constants/store';
import selectSessionToken from '../selectors/sessionToken';
import getGraphQLRequestHeaders from '../utils/getGraphQLRequestHeaders';

const httpLink = createHttpLink({
  uri: `/graphql`
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 30000,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error
  }
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const storeState = store.getState();
  const sessionToken = selectSessionToken(storeState);
  operation.setContext({
    headers: {
      ...getGraphQLRequestHeaders(sessionToken)
    }
  });

  return forward(operation);
});

const errorLink = onError(({ networkError = {}, graphQLErrors }) => {
  if (
    graphQLErrors &&
    graphQLErrors[0].message === 'TokenExpiredError: jwt expired'
  ) {
    store.dispatch(sessionClearAction());
    return;
  }

  store.dispatch(
    errorAction({
      error: graphQLErrors,
      title: 'GraphQL Error',
      description: String(graphQLErrors)
    })
  );
});

const link = middlewareLink
  .concat(retryLink)
  .concat(errorLink)
  .concat(httpLink);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
