import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { reduxForm, Field } from 'redux-form';
import { EDIT_REVIEW_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MaterialButton from '../../components/MaterialButton';
import { connect } from 'react-redux';
import FieldTextInput from '../../components/FieldTextInput';

class PQCellEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.change('review', this.props.row);
  }

  getValue() {
    return this.props.panelPin;
  }

  render() {
    const { onUpdate, t, handleSubmit, row, ...rest } = this.props;

    const handleClick = e => {
      handleSubmit(e);
      onUpdate(row.perceivedQuality);
    };

    return (
      <div>
        <Field
          name="perceivedQuality"
          component={FieldTextInput}
          type="number"
          fullWidth
          placeholder={t('reviews.searchPanelPlaceholder')}
          InputProps={{ inputProps: { min: 1, max: 7 } }}
        />
        <MaterialButton outlined teal onClick={handleClick}>
          Done
        </MaterialButton>
        <MaterialButton
          outlined
          teal
          onClick={() => onUpdate(row.perceivedQuality)}
        >
          Cancel
        </MaterialButton>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const values =
    state.form.EDIT_REVIEW_FORM && state.form.EDIT_REVIEW_FORM.values;

  return {
    perceivedQuality: values && values.perceivedQuality
  };
};

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default reduxForm({
  form: EDIT_REVIEW_FORM,
  onSubmit: (values, dispatch) => {
    console.log(values);
    dispatch(formSubmit(EDIT_REVIEW_FORM));
  },
  validate: values => {
    return {
      perceivedQuality: validation(values.perceivedQuality)
    };
  }
})(connect(mapStateToProps)(withTranslation()(PQCellEdit)));
