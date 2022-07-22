import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFormValues } from 'redux-form';
import { BATCH_INITIALIZATION_FORM } from '../../constants/formNames';
import BatchInitializationFormFragmentInitialBatchState from './batchInitializationFormFragmentInitialBatchState';

function mapStateToProps(state) {
  const batchInitializationFormValues = getFormValues(
    BATCH_INITIALIZATION_FORM
  )(state);
  const productId =
    batchInitializationFormValues && batchInitializationFormValues.productId;

  return {
    productId
  };
}

const ProductProductClassQuery = gql`
  query ProductProductClassQuery($productId: Int!) {
    product: productById(id: $productId) {
      productClass
    }
  }
`;

export default compose(
  connect(mapStateToProps),
  graphql(ProductProductClassQuery, {
    options: ({ productId }) => ({
      variables: {
        productId
      }
    }),
    props: ({ data: { loading, product } }) => ({
      loading,
      productClass: product && product.productClass
    }),
    skip: ({ productId }) => !productId
  })
)(BatchInitializationFormFragmentInitialBatchState);
