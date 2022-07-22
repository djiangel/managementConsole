import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import GastrographRadarChart from '../../components/GastrographRadarChart';
import Table from '../../components/Table';
import { PRODUCT, PRODUCT_REVIEW, USER } from '../../constants/routePaths';
import ProductReviewListQuery from '../../graphql/queries/ProductReviewList';
import formatPath from '../../utils/formatPath';
import QueryPaginationContainer from '../QueryPagination';

const pageLength = 10;

type Props = {
  location: { search: string },
  batchIdentifier: ?string,
  panelId: ?number,
  productId: ?number,
  producerId: number,
  userId: ?number
};

export default class ProductReviewListContainer extends Component {
  props: Props;

  render() {
    const {
      location,
      batchIdentifier,
      panelId,
      productId,
      producerId,
      userId
    } = this.props;
    const locationQueryString = location.search && location.search.slice(1);
    const locationQuery = qs.parse(locationQueryString);

    return (
      <div>
        <QueryPaginationContainer
          after={locationQuery.after}
          before={locationQuery.before}
          getQueryResultNodes={data =>
            data && data.productReviews && data.productReviews.nodes
          }
          getQueryResultPageInfo={data =>
            data && data.productReviews && data.productReviews.pageInfo
          }
          renderPage={items => (
            <Table
              headerRow={
                <tr>
                  <td>Review ID</td>
                  <td>Product Name</td>
                  <td>Reviewer Name</td>
                  <td>Perceived Quality</td>
                  <td>Gastrograph Entry</td>
                  <td>Product Notes</td>
                  <td>User Notes</td>
                  <td>Attributes</td>
                  <td>Reference Flavors</td>
                  <td>Created At</td>
                  <td>Updated At</td>
                </tr>
              }
              items={items}
              renderBodyRow={item => (
                <tr key={item.id}>
                  <td>
                    <Link
                      to={formatPath(PRODUCT_REVIEW, {
                        reviewId: item.id
                      })}
                    >
                      {item.id}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={formatPath(PRODUCT, {
                        productId: item.product.id
                      })}
                    >
                      {item.product.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={formatPath(USER, {
                        username: item.user.username
                      })}
                    >
                      {item.user.name}
                    </Link>
                  </td>
                  <td>{item.perceivedQuality}</td>
                  <td>
                    <GastrographRadarChart compact gastrographEntry={item} />
                  </td>
                  <td>{item.productNotes}</td>
                  <td>{item.userNotes}</td>
                  <td>
                    {item.attributes &&
                      JSON.stringify(item.attributes, null, 2)}
                  </td>
                  <td>{item.referenceFlavors}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.updatedAt}</td>
                </tr>
              )}
            />
          )}
          pageLength={pageLength}
          query={ProductReviewListQuery}
          queryVariables={{
            batchIdentifier,
            panelId,
            productId,
            producerId,
            userId
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
      </div>
    );
  }
}
