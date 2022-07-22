import * as React from 'react';
import AllProductSearchQuery from '@graphql/queries/AllProductSearchQuery';
import { ApolloConsumer } from 'react-apollo';
import { ErrorComponent } from './ErrorComponent';
import { WithTranslation, withTranslation } from 'react-i18next';
import FormSectionHeader from 'components/FormSectionHeader';
import FormInputSelect from 'components/FormInputSelect';

const styles = require('./CreateReview.module.css');

interface Props extends WithTranslation {
  setFieldValue: Function;
  errors: any;
  touched: any;
  handleBlur: Function;
}

class ProductSearch extends React.Component<Props> {
  state = {
    selectedOption: null
  };

  render() {
    const { setFieldValue, handleBlur, t } = this.props;
    const { selectedOption } = this.state;

    return (
      <div>
        <div className={styles.container}>
          <FormSectionHeader text={`${t('reviews.products')}*`} />
          <ApolloConsumer>
            {client => (
                <FormInputSelect
                  async
                  value={selectedOption}
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
                  onBlur={handleBlur('productReview.productId')}
                  onChange={selected => {
                    if (selected)
                      this.setState(
                        {
                          selectedOption: selected
                        },
                        () =>
                          setFieldValue(
                            'productReview.productId',
                            selected.value
                          )
                      );
                  }}
                />
            )}
          </ApolloConsumer>
        </div>
        <ErrorComponent {...this.props} errorType="productId" />
      </div>
    );
  }
}

export default withTranslation()(ProductSearch);
