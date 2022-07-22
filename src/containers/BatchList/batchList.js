import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import Table from '../../components/Table';
import { BATCH, PRODUCT } from '../../constants/routePaths';
import BatchListQuery from '../../graphql/queries/BatchList';
import formatPath from '../../utils/formatPath';
import QueryPaginationContainer from '../QueryPagination';
import { StyledContainerDiv } from './StyledComponents';

const pageLength = 10;

type Props = {
  location: { search: string },
  producerId: number
};

export default class BatchList extends Component {
  props: Props;

  render() {
    const { location, producerId } = this.props;
    const locationQueryString = location.search && location.search.slice(1);
    const locationQuery = qs.parse(locationQueryString);

    return (
      <StyledContainerDiv>
        <QueryPaginationContainer
          after={locationQuery.after}
          before={locationQuery.before}
          getQueryResultNodes={data =>
            data &&
            data.producer &&
            data.producer.batches &&
            data.producer.batches.nodes
          }
          getQueryResultPageInfo={data =>
            data &&
            data.producer &&
            data.producer.batches &&
            data.producer.batches.pageInfo
          }
          renderPage={items => (
            <Table
              headerRow={
                <tr>
                  <td>Batch Identifier</td>
                  <td>Product</td>
                </tr>
              }
              items={items}
              renderBodyRow={item => (
                <tr key={item.id}>
                  <td>
                    <Link
                      to={formatPath(BATCH, {
                        batchId: item.batchIdentifier
                      })}
                    >
                      {item.batchIdentifier}
                    </Link>
                  </td>
                  <td>
                    {item.product ? (
                      <Link
                        to={formatPath(PRODUCT, {
                          productId: item.productId
                        })}
                      >
                        {item.product.name}
                      </Link>
                    ) : (
                      <span className="noProductLabel">
                        No Associated Product
                      </span>
                    )}
                  </td>
                </tr>
              )}
            />
          )}
          pageLength={pageLength}
          query={BatchListQuery}
          queryVariables={{
            producerId
          }}
          getNextButtonLinkLocation={({ endCursor }) => ({
            ...location,
            search: `?${qs.stringify({ after: endCursor })}`
          })}
          getPreviousButtonLinkLocation={({ startCursor }) => ({
            ...location,
            search: `?${qs.stringify({ before: startCursor })}`
          })}
        />
      </StyledContainerDiv>
    );
  }
}
