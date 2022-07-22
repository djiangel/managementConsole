import * as React from 'react';
import UserSearchQuery from '@graphql/queries/UserSearchQuery';
import { ApolloConsumer } from 'react-apollo';
import { ErrorComponent } from './ErrorComponent';
import { WithTranslation, withTranslation } from 'react-i18next';
import FormSectionHeader from 'components/FormSectionHeader';
import FormInputSelect from 'components/FormInputSelect';

const styles = require('./CreateReview.module.css');

interface Props extends WithTranslation {
  setFieldValue: Function;
  errors: any;
  values: any;
  touched: boolean;
  handleBlur: Function;
}

interface State {
  selectedOption: object;
}

class UserSearch extends React.Component<Props, State> {
  state = {
    selectedOption: null
  };
  render() {
    const { setFieldValue, handleBlur, t } = this.props;
    const { selectedOption } = this.state;

    return (
      <div>
        <div className={styles.container}>
          <FormSectionHeader text={`${t('reviews.userId')}*`} />
          <ApolloConsumer>
            {client => (
              <FormInputSelect
                async
                value={selectedOption}
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
                onBlur={handleBlur('productReview.userId')}
                onChange={selected => {
                  if (selected)
                    this.setState(
                      {
                        selectedOption: selected
                      },
                      () =>
                        setFieldValue('productReview.userId', selected.value)
                    );
                  else
                    this.setState(
                      {
                        selectedOption: null
                      },
                      () => setFieldValue('productReview.userId', '')
                    );
                }}
              />
            )}
          </ApolloConsumer>
        </div>
        <ErrorComponent {...this.props} errorType="userId" />
      </div>
    );
  }
}

export default withTranslation()(UserSearch);
