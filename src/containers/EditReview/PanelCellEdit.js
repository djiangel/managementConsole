import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { reduxForm, Field } from 'redux-form';
import { EDIT_REVIEW_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MaterialButton from '../../components/MaterialButton';
import { connect } from 'react-redux';
import FieldTextInput from '../../components/FieldTextInput';

class PanelCellEdit extends React.Component {
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
      onUpdate(row.panel);
    };

    return (
      <div>
        <Field
          name="panelPin"
          component={FieldTextInput}
          fullWidth
          placeholder={t('reviews.searchPanelPlaceholder')}
        />
        <MaterialButton outlined teal onClick={handleClick}>
          Done
        </MaterialButton>
        <MaterialButton outlined teal onClick={() => onUpdate(row.product)}>
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
    panelPin: values && values.panelPin
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
      panelPin: validation(values.panelPin)
    };
  }
})(connect(mapStateToProps)(withTranslation()(PanelCellEdit)));
