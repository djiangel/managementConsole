import * as React from 'react';
import { Formik } from 'formik';
import Filter from './Filter';
import { FormikActions } from "formik";
import Result from './Result';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';

const styles = require('./EditReview.module.css');

export const EditReviewContainer: React.FunctionComponent = () => {

  const [showTable, setShowTable] = React.useState(false);

  const [table, setTable] = React.useState(null);

  const { t } = useTranslation();

  const handleSubmit = async (values, actions: FormikActions<any>) => {
    console.log("Submit...")
    setTable(<Result
      userId={parseInt(values.productReview.userId)}
      productId={parseInt(values.productReview.productId)}
      panelId={parseInt(values.productReview.panelId)}
      last={10}
    />);
    setShowTable(true);
    actions.setSubmitting(false);
  };

  return (
    <Paper className={styles.container}>
      <h3 className={styles.productTitle}>{t('navigation.editReviews')}</h3>
      <Formik
        initialValues={{
          productReview: {
            userId: '',
            productId: '',
          }
        }}
        validateOnBlur={true}
        onSubmit={handleSubmit}
        // validate={validateEditReviewForm}
        render={props => <Filter {...props} />}
      />
      {showTable && table}
    </Paper>
  )
};

export default EditReviewContainer;
