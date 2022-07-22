import React from 'react';
import { graphql } from 'react-apollo';
import QueryPagination from './queryPagination';

type PageInfo = {
  startCursor: string,
  endCursor: string,
  hasNextPage: boolean,
  hasPreviousPage: boolean
};

type LinkLocation = string | Object;

type ContainerProps = {
  after: ?string,
  before: ?string,
  getNextButtonLinkLocation: (pageInfo: PageInfo) => LinkLocation,
  getPreviousButtonLinkLocation: (pageInfo: PageInfo) => LinkLocation,
  getQueryResultNodes: (result: Object) => Object[],
  getQueryResultPageInfo: (result: Object) => PageInfo,
  pageLength: number,
  query: any,
  queryVariables: ?Object
};

const GraphQLContainer = (props: ContainerProps) => {
  const Container = graphql(props.query, {
    options: {
      variables: {
        ...props.queryVariables,
        first: !props.before ? props.pageLength : undefined,
        after: props.after,
        last: props.before ? props.pageLength : undefined,
        before: props.before
      }
    },
    props: ({ data }) => {
      const pageInfo = props.getQueryResultPageInfo(data);

      return {
        loading: data.loading,
        nextButtonLinkLocation:
          pageInfo &&
          pageInfo.hasNextPage &&
          props.getNextButtonLinkLocation(pageInfo),
        previousButtonLinkLocation:
          pageInfo &&
          pageInfo.hasPreviousPage &&
          props.getPreviousButtonLinkLocation(pageInfo),
        resultNodes: props.getQueryResultNodes(data)
      };
    }
  })(QueryPagination);

  return <Container {...props} />;
};

GraphQLContainer.displayName = `GraphQLContainer(${
  QueryPagination.displayName
})`;

export default GraphQLContainer;
