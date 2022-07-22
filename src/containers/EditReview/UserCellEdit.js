import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import UserSearchQuery from '@graphql/queries/UserSearchQuery';
import FormInputSelect from 'components/FormInputSelect';
import { withTranslation } from 'react-i18next';
import { reduxForm, Field } from 'redux-form';
import { EDIT_REVIEW_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import MaterialButton from '../../components/MaterialButton';
import FormInput from '../../components/FormInput';
import { connect } from 'react-redux';

class UserCellEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.change('review', this.props.row);
  }

  getValue() {
    return this.props.user.label;
  }

  render() {
    const { onUpdate, t, handleSubmit, row, ...rest } = this.props;

    const handleClick = e => {
      handleSubmit(e);
      onUpdate(row.user);
    };

    return (
      <div>
        <ApolloConsumer>
          {client => (
            <Field
              name="user"
              component={FormInput}
              inputComponent={FormInputSelect}
              async
              fullWidth
              placeholder={t('reviews.userIdPlaceholder')}
              loadOptions={async value => {
                if (value && value.trim().length < 4) {
                  return [];
                }

                const { data } = await client.query({
                  query: UserSearchQuery,
                  variables: {
                    query: value
                  }
                });
                if (data && data.user) {
                  return data.user.nodes.map(user => ({
                    label: `${user.username} ${user.email}`,
                    value: user.id
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
    user: values && values.user
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
      user: validation(values.user)
    };
  }
})(connect(mapStateToProps)(withTranslation()(UserCellEdit)));
