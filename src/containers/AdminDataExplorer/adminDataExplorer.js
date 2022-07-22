/* global fetch, window */
import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import getGraphQLRequestHeaders from '../../utils/getGraphQLRequestHeaders';
import { StyledContainerDiv } from './StyledComponents';

export default class AdminDataExplorerContainer extends Component {
  fetchGraphQL = graphQLParams => {
    const { sessionToken } = this.props;

    return fetch('/graphql', {
      method: 'post',
      headers: {
        ...getGraphQLRequestHeaders(sessionToken),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphQLParams)
    }).then(response => response.json());
  };

  render() {
    return (
      <StyledContainerDiv>
        <GraphiQL fetcher={this.fetchGraphQL} />
      </StyledContainerDiv>
    );
  }
}
