import * as React from 'react';
const styles = require('./CreateReview.module.css');

export const ErrorComponent = ({ errors, touched, errorType }) => {
  if (
    errors &&
    errors[errorType] &&
    touched.productReview &&
    touched.productReview[errorType]
  ) {
    return (
      <div className={styles.errorContainer}>
          <div>{errors[errorType]}</div>
      </div>
    );
  } else {
    return <div />;
  }
};
