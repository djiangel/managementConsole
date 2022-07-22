import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { withTranslation } from 'react-i18next';
import User from './User';

export const UserQuery = gql`
  query UserQuery($username: String!) {
    user: userByUsername(username: $username) {
      id
      username
      name
      email
      phoneNumber
      dateOfBirth
      defaultProductReviewEstablishment
      ethnicity
      firstLanguage
      gender
      race
      smoke
      createdAt
      updatedAt
      role
      producerUsers: producerUsersByUserId {
        totalCount
        nodes {
          id
          producerId
        }
      }
      productReviews: productReviewsByUserId {
        totalCount
      }
    }
  }
`;

const mapStateToProps = state => ({
  userId: state.session && state.session.userId,
  workspaceId: state.workspaceProducerId && state.workspaceProducerId.key
});

const mapDispatchToProps = dispatch => ({
  handleDeleteUser: userId => dispatch({ type: 'DELETE_USER', payload: userId })
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(UserQuery, {
    options: ({ match }) => ({
      variables: {
        username: decodeURI(match.params.username)
      }
    }),
    props: ({ data: { loading, user } }) => ({
      loading,
      producerUsersCount:
        user && user.producerUsers && user.producerUsers.totalCount,
      productReviewsCount:
        user && user.productReviews && user.productReviews.totalCount,
      userAttributes: user && {
        ...user,
        // Exclude the following user properties from the userAttributes table
        __typename: undefined,
        productReviews: undefined,
        producerUsersCount: undefined,
        productReviewsCount: undefined
      }
    })
  }),
  withTranslation()
)(User);
