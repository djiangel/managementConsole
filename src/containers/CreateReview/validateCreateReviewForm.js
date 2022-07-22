export const validateCreateReviewForm = values => {
  const errors: any = {};

  if (
    !values.productReview.userId ||
    values.productReview.userId === undefined ||
    values.productReview.userId === '' ||
    values.productReview.userId === null
  ) {
    errors.userId = 'Please select a valid user.';
  }
  if (
    !values.productReview.productId ||
    values.productReview.productId === undefined ||
    values.productReview.productId === '' ||
    values.productReview.productId === null
  ) {
    errors.productId = 'Please select a valid product.';
  }
  if (
    !values.productReview.perceivedQuality ||
    values.productReview.perceivedQuality === undefined ||
    values.productReview.perceivedQuality === '' ||
    values.productReview.perceivedQuality === null
  ) {
    errors.perceivedQuality = 'Please select a Perceived Quality.';
  }
  return errors;
};
