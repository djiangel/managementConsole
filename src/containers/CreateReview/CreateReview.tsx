import * as React from 'react';
import ProductSearch from './ProductSearchComponent';
import UserSearch from './UserSearchComponent';
import GGVarTable from './GGVarTableComponent';
import PanelSearch from './PanelSearchComponent';
import Texture from './TextureComponent';
import FormSectionHeader from 'components/FormSectionHeader';
import FieldTextInput from 'components/FieldTextInput';
import PQ from './PQComponent';
import { WithTranslation, withTranslation } from 'react-i18next';
import MaterialButton from 'components/MaterialButton';

const styles = require('./CreateReview.module.css');

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

class CreateReview extends React.Component<Props> {
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
          </div>
        </div>
        <div>
          <div>
            <PanelSearch {...this.props} />
          </div>
        </div>

        <GGVarTable {...this.props} />

        <div className={styles.sectionContainer}>
          <FormSectionHeader text={t('reviews.texture')} />
          <Texture {...this.props} />
        </div>

        <div className={styles.sectionContainer}>
          <FormSectionHeader text={t('reviews.userNotes')} />
          <FieldTextInput
            id="userNotes"
            value={
              values.productReview.userNotes
                ? values.productReview.userNotes
                : ''
            }
            placeholder={t('reviews.userNotesPlaceholder')}
            onChange={() =>
              setFieldValue(
                'productReview.userNotes',
                (event.target as HTMLTextAreaElement).value
              )
            }
            rows={4}
            multiline={true}
            variant="outlined"
          />
        </div>
        <PQ {...this.props} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          <MaterialButton
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting || !isValid}
          >
            {t('reviews.createReview')}
          </MaterialButton>
        </div>
      </form>
    );
  }
}

export default withTranslation()(CreateReview);
