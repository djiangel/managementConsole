import ProductTable from './ProductTable';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import changeProductTablePage from '../../actions/changeProductTablePage';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import ProductsQuery from '../../graphql/queries/ProductsQuery';
import FoldersQuery from '../../graphql/queries/FoldersQuery';
import { withTranslation } from 'react-i18next';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  productTablePage: state.productTablePage,
  productFolderId: state.productFolderId
});

const mapDispatchToProps = dispatch => ({
  changeProductTablePage: page => dispatch(changeProductTablePage(page))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(ProductsQuery, {
    options: (props: any) => ({
      variables: {
        first: 25,
        condition: {
          producerId: props.producerId,
          folderId: props.productFolderId != 0 ? props.productFolderId : undefined,
          visibility: true
        },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true
    }),
    name: 'productResults'
  }),
  graphql(FoldersQuery, {
    options: (props: any) => ({
      variables: {
        condition: {
          producerId: props.producerId
        }
      }
    }),
    name: 'folderResults'
  }),
  withTranslation()
)(ProductTable);
