import { put, select, take } from 'redux-saga/effects';
import {
  getFormValues,
  startSubmit,
  stopSubmit,
  change,
  reset
} from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { HEAVY_USER_INFO_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import gql from 'graphql-tag';
import AllProductCategoriesQuery from '../graphql/queries/AllProductCategoriesQuery';
import AllProductFeaturesQuery from '../graphql/queries/AllProductFeaturesQuery';
import AllProductComponentBasesQuery from '../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../graphql/queries/AllProductComponentOthersQuery';
import { flatten } from 'lodash';

const HeavyUserByUsernameQuery = gql`
  query HeavyUserByUsernameQuery($username: String!) {
    user: userByUsername(username: $username) {
      id
      isHeavyUser
      heavyUsersByUserId {
        nodes {
          id
          tag
          categoryIds
          featureIds
          componentBaseIds
          componentOtherIds
        }
      }
    }
  }
`;

const HeavyUserByEmailQuery = gql`
  query HeavyUserByEmailQuery($email: String!) {
    user: userByEmail(email: $email) {
      id
      isHeavyUser
      heavyUsersByUserId {
        nodes {
          id
          tag
          categoryIds
          featureIds
          componentBaseIds
          componentOtherIds
        }
      }
    }
  }
`;

export default function* heavyUserInfoFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === HEAVY_USER_INFO_FORM
    );

    yield put(startSubmit(HEAVY_USER_INFO_FORM));

    const formValues = yield select(getFormValues(HEAVY_USER_INFO_FORM));

    const { username, email } = formValues;

    try {
      const heavyUserQuery = yield graphqlClient.query({
        query: email ? HeavyUserByEmailQuery : HeavyUserByUsernameQuery,
        variables: email
          ? {
              email
            }
          : {
              username
            },
        fetchPolicy: 'no-cache'
      });

      const { data } = heavyUserQuery;

      if (data.user.isHeavyUser) {
        const categoriesQuery = yield graphqlClient.query({
          query: AllProductCategoriesQuery,
          variables: {
            orderBy: 'ID_ASC',
            condition: {
              producerId: 25
            },
            filter: {
              id: {
                in:
                  data.user.heavyUsersByUserId &&
                  flatten(
                    data.user.heavyUsersByUserId.nodes.map(
                      node => node.categoryIds
                    )
                  ).filter(value => !!value)
              }
            }
          }
        });

        const featuresQuery = yield graphqlClient.query({
          query: AllProductFeaturesQuery,
          variables: {
            orderBy: 'ID_ASC',
            condition: {
              producerId: 25
            },
            filter: {
              id: {
                in:
                  data.user.heavyUsersByUserId &&
                  flatten(
                    data.user.heavyUsersByUserId.nodes.map(
                      node => node.featureIds
                    )
                  ).filter(value => !!value)
              }
            }
          }
        });

        const componentBasesQuery = yield graphqlClient.query({
          query: AllProductComponentBasesQuery,
          variables: {
            orderBy: 'ID_ASC',
            condition: {
              producerId: 25
            },
            filter: {
              id: {
                in:
                  data.user.heavyUsersByUserId &&
                  flatten(
                    data.user.heavyUsersByUserId.nodes.map(
                      node => node.componentBaseIds
                    )
                  ).filter(value => !!value)
              }
            }
          }
        });

        const componentOthersQuery = yield graphqlClient.query({
          query: AllProductComponentOthersQuery,
          variables: {
            orderBy: 'ID_ASC',
            condition: {
              producerId: 25
            },
            filter: {
              id: {
                in:
                  data.user.heavyUsersByUserId &&
                  flatten(
                    data.user.heavyUsersByUserId.nodes.map(
                      node => node.componentOtherIds
                    )
                  ).filter(value => !!value)
              }
            }
          }
        });

        const categoriesMap = {};

        categoriesQuery.data.productCategories.nodes.forEach(
          category => (categoriesMap[category.id] = category.name)
        );

        const featuresMap = {};

        featuresQuery.data.productFeatures.nodes.forEach(
          feature => (featuresMap[feature.id] = feature.name)
        );

        const componentBasesMap = {};

        componentBasesQuery.data.productComponentBases.nodes.forEach(
          componentBase =>
            (componentBasesMap[componentBase.id] = componentBase.name)
        );

        const componentOthersMap = {};

        componentOthersQuery.data.productComponentOthers.nodes.forEach(
          componentOther =>
            (componentOthersMap[componentOther.id] = componentOther.name)
        );

        data.user.heavyUsersByUserId.nodes.forEach(
          node =>
            (node.categories =
              node.categoryIds && node.categoryIds.map(id => categoriesMap[id]))
        );
        data.user.heavyUsersByUserId.nodes.forEach(
          node =>
            (node.features =
              node.featureIds && node.featureIds.map(id => featuresMap[id]))
        );
        data.user.heavyUsersByUserId.nodes.forEach(
          node =>
            (node.componentBases =
              node.componentBaseIds &&
              node.componentBaseIds.map(id => componentBasesMap[id]))
        );
        data.user.heavyUsersByUserId.nodes.forEach(
          node =>
            (node.componentOthers =
              node.componentOtherIds &&
              node.componentOtherIds.map(id => componentOthersMap[id]))
        );
      }

      yield put(change(HEAVY_USER_INFO_FORM, 'data', heavyUserQuery.data));

      yield put(stopSubmit(HEAVY_USER_INFO_FORM));
    } catch (error) {
      yield put(stopSubmit(HEAVY_USER_INFO_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Load User Info',
          description: error.message
        })
      );
    }
  }
}
