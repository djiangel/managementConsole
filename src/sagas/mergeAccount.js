import { call, fork, put, select, takeEvery, take } from 'redux-saga/effects';
import { getFormValues, startSubmit, stopSubmit, destroy } from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { MERGE_ACCOUNT_FORM } from '../constants/formNames';
import appToastAdd from '../actions/appToastAdd';
import graphqlClient from '../consumers/graphqlClient';
import UserByEmail from '../graphql/queries/UserByEmail';
import UserReviewsCount from '../graphql/queries/UserReviewsCount';
import MergeProductReviewsByUser from '../graphql/mutations/MergeProductReviewsByUser';
import confirmationSaga from './confirmationSaga';
import DeleteUserById from '../graphql/mutations/DeleteUserById';

export default function* mergeAccountFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === MERGE_ACCOUNT_FORM
    );

    yield put(startSubmit(MERGE_ACCOUNT_FORM));

    const mergeAccountFormValues = yield select(
      getFormValues(MERGE_ACCOUNT_FORM)
    );

    mergeAccountFormValues.oldEmail = mergeAccountFormValues.oldEmail.toLowerCase();
    mergeAccountFormValues.newEmail = mergeAccountFormValues.newEmail.toLowerCase();

    try {
      // Submit mergeAccountFormValues via createJSONWebToken...
      const oldAccount = yield graphqlClient.query({
        query: UserByEmail,
        variables: {
          email: mergeAccountFormValues.oldEmail
        }
      });

      const newAccount = yield graphqlClient.query({
        query: UserByEmail,
        variables: {
          email: mergeAccountFormValues.newEmail
        }
      });

      if (!oldAccount.data.user || !newAccount.data.user) {
        throw new Error("Accounts don't exist");
      }

      const oldAccountId = oldAccount.data.user.id;
      const newAccountId = newAccount.data.user.id;

      const reviewsQuery = yield graphqlClient.query({
        query: UserReviewsCount,
        variables: {
          userId: oldAccountId
        }
      });

      const count = reviewsQuery.data.allProductReviews.totalCount;

      const isConfirm = yield call(confirmationSaga, {
        title: 'Merge Account',
        message: `${count} reviews by user ${oldAccountId} found. Do you want to merge them?`
      });

      // yield put(
      //   appToastAdd({
      //     durationMilliseconds: 4000,
      //     message: `${count} reviews by user ${oldAccountId} found`,
      //     title: 'Merge Account',
      //     toastKey: `toast_${Date.now()}`
      //   })
      // );
      if (isConfirm) {
        const mergeQuery = yield graphqlClient.mutate({
          mutation: MergeProductReviewsByUser,
          variables: {
            oldUserId: oldAccountId,
            newUserId: newAccountId
          }
        });

        yield put(
          appToastAdd({
            durationMilliseconds: 4000,
            message: `${
              mergeQuery.data.updated.productReviews.length
            } reviews migrated`,
            title: 'Account Migration Successful',
            toastKey: `toast_${Date.now()}`
          })
        );

        const deleteAccount = yield call(confirmationSaga, {
          title: 'Delete Account',
          message: `Do you want to delete the old user ${oldAccountId} with email ${
            mergeAccountFormValues.oldEmail
          }?`
        });

        if (deleteAccount) {
          yield graphqlClient.mutate({
            mutation: DeleteUserById,
            variables: {
              id: oldAccountId
            }
          });

          yield put(
            appToastAdd({
              durationMilliseconds: 4000,
              message: `User ${oldAccountId} deleted`,
              title: 'User Deletion Successful',
              toastKey: `toast_${Date.now()}`
            })
          );
        }

        // If this point is reached, the form was submitted without error
        yield put(stopSubmit(MERGE_ACCOUNT_FORM));

        // Destroy the form so that it is re-rendered after the below route change
        yield put(destroy(MERGE_ACCOUNT_FORM));
      } else {
        yield put(stopSubmit(MERGE_ACCOUNT_FORM));
      }
    } catch (error) {
      yield put(stopSubmit(MERGE_ACCOUNT_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Create User',
          description: error.message
        })
      );
    }
  }
}
