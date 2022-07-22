import React from 'react';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose, mapProps } from 'recompose';
import Reports from './reports';
import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';

const panelistReviewCountByProduct = gql`
  query PanelistReviewCountByProduct($workspaceId: Int!) {
    reviews: allProductReviews(condition: { producerId: $workspaceId }) {
      nodes {
        user: userByUserId {
          id
          name
          email
        }

        product: productByProductId {
          id
          name
        }
      }
    }
  }
`;

const mapStateToProps = state => ({
  workspaceId: selectWorkspaceProducerId(state)
});

const transformProps = props => {
  if (props.data.loading) {
    return {
      loading: props.data.loading,
      reviewMap: {},
      productMap: {},
      userMap: {}
    };
  }

  if (props.data.error) {
    return {
      error: props.data.error,
      reviewMap: {},
      productMap: {},
      userMap: {}
    };
  }

  const reviews = props.data.reviews.nodes;
  const reviewMap = {};
  const productMap = {};
  const userMap = {};

  // Calculate the frequency of each product being reviewed per user
  reviews.forEach(review => {
    if (!review.product || !review.user) {
      return;
    }

    const currentFreq = _.get(
      reviewMap,
      `${review.user.id}.${review.product.id}`,
      0
    );
    _.set(reviewMap, `${review.user.id}.${review.product.id}`, currentFreq + 1);

    _.set(productMap, review.product.id, review.product.name);
    _.set(userMap, review.user.id, review.user.email);
  });

  return {
    reviewMap,
    productMap,
    userMap
  };
};

const enhance = compose(
  connect(mapStateToProps),
  graphql(panelistReviewCountByProduct, {
    options: ({ workspaceId }) => ({
      variables: {
        workspaceId
      }
    })
  }),
  mapProps(transformProps)
);
export default enhance(Reports);
