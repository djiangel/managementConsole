import * as React from 'react';
import FormSectionHeader from "components/FormSectionHeader";
import { withTranslation, WithTranslation } from "react-i18next";
import FieldTextInput from "components/FieldTextInput";

const styles = require('./CreateReview.module.css');

interface Props extends WithTranslation {
  setFieldValue: Function;
  values: any
}

class PanelSearchComponent extends React.Component<Props> {
  render() {
    const {setFieldValue, values, t} = this.props;

    // TODO: Implement Typeahead for existing panel in future
    return (
    <div className={styles.container}>
      <FormSectionHeader text={t('reviews.panel')} />
      <div>
        <FieldTextInput
          id="panelId"
          value={
            values.productReview.panelId
              ? values.productReview.panelId
              : ""
          }
          onChange={() => {
            setFieldValue(
              'productReview.panelId',
              Number((event.target as HTMLTextAreaElement).value)
            );
          }}
          placeholder="Panel ID"
          fullWidth
        />
      </div>
    </div>
    )
  }
}

export default withTranslation()(PanelSearchComponent)