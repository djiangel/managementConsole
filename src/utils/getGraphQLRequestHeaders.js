export default function getGraphQLRequestHeaders(sessionToken) {
  const authorizationHeaderValue = sessionToken && `Bearer ${sessionToken}`;
  const graphQLRequestHeaders = {};

  if (authorizationHeaderValue) {
    graphQLRequestHeaders.Authorization = authorizationHeaderValue;
  }

  return graphQLRequestHeaders;
}
