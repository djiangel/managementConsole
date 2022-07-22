import * as React from 'react';
import ProductSearch from '../CreateReview/ProductSearchComponent';
import UserSearch from '../CreateReview/UserSearchComponent';
import PanelSearch from '../CreateReview/PanelSearchComponent';
import { WithTranslation, withTranslation } from 'react-i18next';
import MaterialButton from 'components/MaterialButton';

const styles = require('./EditReview.module.css');

interface Props extends WithTranslation {
  setFieldValue: Function;
  values: any;
  isSubmitting: boolean;
  isValid: boolean;
  handleSubmit: any;
  initialValues: any;
  handleBlur: Function;
  touched: any;
  errors: any;
}

class EditReview extends React.Component<Props> {
  render() {
    let {
      setFieldValue,
      values,
      isSubmitting,
      isValid,
      handleSubmit,
      t
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <div className={styles.fieldContainer}>
            <UserSearch {...this.props} />
            <ProductSearch {...this.props} />
            <PanelSearch {...this.props} />
            <MaterialButton
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isSubmitting || !isValid}
            >
              {t('reviews.searchReviews')}
            </MaterialButton>
          </div>
        </div>
      </form>
    );
  }
}

export default withTranslation()(EditReview);
