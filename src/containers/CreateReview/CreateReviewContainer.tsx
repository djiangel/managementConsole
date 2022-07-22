import * as React from 'react';
import { Formik } from 'formik';
import * as GGVars from './GGVar.json';
import { handleReviewCreation } from './handleReviewCreation';
import CreateReview from './CreateReview';
import { validateCreateReviewForm } from './validateCreateReviewForm';
import Paper from '@material-ui/core/Paper';
import i18n from '../../i18n';

const styles = require('./CreateReviewContainer.module.css');

export const CreateReviewContainer: React.FunctionComponent = () => (
  <Paper className={styles.container}>
    <div className={styles.headerContainer}>
      <div className={styles.headerTextContainer}>
        <h5 className={styles.reviewHeader}>Reviews</h5>
        <h3 className={styles.reviewTitle}>{i18n.t('reviews.createReview')}</h3>
      </div>
    </div>
    <Formik
      initialValues={{
        GGVars: GGVars,
        productReview: {
          userId: '',
          productId: '',
          textures: [],
          userNotes: '',
          referenceFlavors: {},
          perceivedQuality: ''
        }
      }}
      validateOnBlur={true}
      onSubmit={handleReviewCreation}
      validate={validateCreateReviewForm}
      render={props => <CreateReview {...props} />}
    />
  </Paper>
);

export default CreateReviewContainer;
