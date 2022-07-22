import * as React from 'react';
import { compose, graphql } from "react-apollo";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withProps } from 'recompose';
import moveFolder from '../../actions/moveFolder';
import deleteFolder from '../../actions/deleteFolder';
import setProductFolderId from '../../actions/productFolderIdSet';
import changeProductTablePage from '../../actions/changeProductTablePage';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import FoldersQuery from '../../graphql/queries/FoldersQuery';
import FolderSystem from './FolderSystem';
import { foldersToTree } from '../../utils/folderHelper';

const styles = require('./ProductFolderContainer.module.css');

class ProductFolderComponent extends React.Component<any, any> {
  state = {
    currentFolderId: 0,
    draggedOverId: null,
    draggedId: null,
    productDraggedId: null,
    expandId: null
  };

  setDraggedOverId = id => this.setState({ draggedOverId: id });

  setDraggedId = id => this.setState({ draggedId: id });

  setProductDraggedId = id => this.setState({ productDraggedId: id });

  setExpandId = id => this.setState({ expandId: id });

  render() {
    const {
      products,
      dispatch,
      folderTree,
      productFolderId,
      setProductFolderId,
      producerId
    } = this.props;

    if (!producerId) return <div />;

    let dragProps = {
      setDraggedOverId: this.setDraggedOverId,
      setDraggedId: this.setDraggedId,
      setProductDraggedId: this.setProductDraggedId,
      draggedOverId: this.state.draggedOverId,
      draggedId: this.state.draggedId,
      productDraggedId: this.state.productDraggedId,
      moveFolder: this.props.moveFolder,
      moveProduct: this.props.moveProduct
    };

    return (
      <div className={styles.container}>
        <FolderSystem
          folderTree={folderTree}
          id={0}
          setFolderId={setProductFolderId}
          openFolder={productFolderId}
          dragProps={dragProps}
          dispatch={dispatch}
          deleteFolder={this.props.deleteFolder}
          products={products}
          expandId={this.state.expandId}
          setExpandId={this.setExpandId}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  productTablePage: state.productTablePage,
  productFolderId: state.productFolderId
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      moveFolder,
      deleteFolder
    },
    dispatch
  ),
  dispatch,
  changeProductTablePage: page => dispatch(changeProductTablePage(page)),
  setProductFolderId: id => dispatch(setProductFolderId(id))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
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
  withProps(({ folderResults }) => {
    let folderTree = foldersToTree(folderResults.folders);
    return {
      folderTree
    };
  })
)(ProductFolderComponent);