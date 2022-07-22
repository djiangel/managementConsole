import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import AllProductSearchQuery from '@graphql/queries/AllProductSearchQuery';
import FormInputSelect from 'components/FormInputSelect';
import { withTranslation } from 'react-i18next';
import { reduxForm, Field } from 'redux-form';
import { EDIT_REVIEW_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MaterialButton from '../../components/MaterialButton';
import FormInput from '../../components/FormInput';
import { connect } from 'react-redux';

class ProductCellEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.change('review', this.props.row);
  }

  getValue() {
    return this.props.product.label;
  }

  render() {
    const { onUpdate, t, handleSubmit, row, ...rest } = this.props;

    const handleClick = e => {
      handleSubmit(e);
      onUpdate(row.product);
    };

    return (
      <div>
        <ApolloConsumer>
          {client => (
            <Field
              name="product"
              component={FormInput}
              inputComponent={FormInputSelect}
              async
              fullWidth
              placeholder={t('reviews.searchProductPlaceholder')}
              loadOptions={async value => {
                if (value && value.trim().length < 3) {
                  return [];
                }

                const { data } = await client.query({
                  query: AllProductSearchQuery,
                  variables: {
                    query: value
                  }
                });

                if (data && data.productResults) {
                  return data.productResults.nodes.map(product => ({
                    label: `${product.name}`,
                    value: product.id
                  }));
                }
                return [];
              }}
            />
          )}
        </ApolloConsumer>
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
    product: values && values.product
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
      product: validation(values.product)
    };
  }
})(connect(mapStateToProps)(withTranslation()(ProductCellEdit)));
