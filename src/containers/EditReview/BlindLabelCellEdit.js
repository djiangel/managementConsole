import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { reduxForm, Field } from 'redux-form';
import { EDIT_REVIEW_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MaterialButton from '../../components/MaterialButton';
import { connect } from 'react-redux';
import FieldTextInput from '../../components/FieldTextInput';
import { compose, graphql } from 'react-apollo';
import FormInputSelect from '../../components/FormInputSelect';
import PanelProductQuery from '../../graphql/queries/PanelProductQuery';
import FormInput from '../../components/FormInput';

class BlindLabelCellEdit extends React.Component {
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
    const {
      onUpdate,
      t,
      handleSubmit,
      row,
      data,
      loading,
      ...rest
    } = this.props;

    const handleClick = e => {
      handleSubmit(e);
      onUpdate(row.panel);
    };

    if (data.loading) {
      return <span>Loading...</span>;
    }

    console.log(data);

    return (
      <div>
        <Field
          name="panelProduct"
          component={FormInput}
          inputComponent={FormInputSelect}
          fullWidth
          placeholder={t('panel.blindLabel')}
          options={data.panelProducts.nodes.map(panelProduct => ({
            value: {
              id: panelProduct.id,
              productId: panelProduct.productId
            },
            label: panelProduct.blindLabel
          }))}
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

export default compose(
  reduxForm({
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
  }),
  connect(mapStateToProps),
  withTranslation(),
  graphql(PanelProductQuery, {
    options: ({ row }) => ({
      variables: {
        panelId: row.panelId
      }
    })
  })
)(BlindLabelCellEdit);
