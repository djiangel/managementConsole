import graphqlClient from 'consumers/graphqlClient';
import CreateProductReviewMutation from '../../graphql/mutations/CreateProductReview';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { FormikActions } from "formik";

export const handleReviewCreation = async (values, actions: FormikActions<any>) => {
  const productReview = {
    ...values.productReview ,
    referenceFlavors: JSON.stringify(values.productReview.referenceFlavors),
    perceivedQuality: Number(values.productReview.perceivedQuality),
    textures: JSON.stringify(values.productReview.textures.map(texture => ({
      texture: texture.value,
      sentiment: texture.sentiment
    })))
  };

  try {
    const createUserReviewResult = await graphqlClient.mutate({
      mutation: CreateProductReviewMutation,
      variables: {
        productReview: productReview
      }
    });

    Alert.success('Review submitted successfully', {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 4000
    });
    actions.setSubmitting(false);
  } catch (e) {
    console.error(e);
    Alert.error('Review not submitted. Please try again', {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 4000
    });
    actions.setErrors({
      submission: 'There was an error creating the review.'
    });
    actions.setSubmitting(false);
  }
};
