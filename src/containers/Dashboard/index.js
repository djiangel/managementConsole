import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import Dashboard from './dashboard';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

const ProducerOverviewQuery = gql`
  query ProducerOverviewQuery($producerId: Int!) {
    producer: producerById(id: $producerId) {
      name
      primaryProductClass

      createdAt
      updatedAt

      users: producerUsersByProducerId {
        totalCount
      }
      userProductReviews: producerUserProductReviews {
        totalCount
      }
      products: productsByProducerId {
        totalCount
      }
    }
  }
`;

export default compose(
  connect(mapStateToProps),
  graphql(ProducerOverviewQuery, {
    options: ({ producerId }) => ({
      variables: {
        producerId
      }
    }),
    props: ({ data: { producer } }) =>
      producer && {
        name: producer.name,
        primaryProductClass: producer.primaryProductClass,

        usersCount: producer.users && producer.users.totalCount,
        userProductReviewsCount:
          producer.userProductReviews && producer.userProductReviews.totalCount,
        productsCount: producer.products && producer.products.totalCount,

        createdAt: producer.createdAt,
        updatedAt: producer.updatedAt
      }
  })
)(Dashboard);
