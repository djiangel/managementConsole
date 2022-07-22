import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Product from './Product';
import ProductByIdQuery from '../../graphql/queries/ProductByIdQuery';
import FoldersQuery from '../../graphql/queries/FoldersQuery';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

const mapDispatchToProps = dispatch => ({
  handleDeleteProduct: productId =>
    dispatch({ type: 'DELETE_PRODUCT', payload: productId })
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation(),
  graphql(ProductByIdQuery, {
    options: ({ match }) => ({
      variables: {
        id: parseInt(match.params.productId)
      }
    }),
    props: ({ data: { loading, product }, ...rest }) => ({
      loading,
      id: product && product.id,
      productProducerId: product && product.producerId,
      name: product && product.name,
      brand: product && product.brand,
      aroma: product && product.aroma,
      localName: product && product.localName,
      oldProductClass: product && product.oldProductClass,
      ingredients: product && product.ingredients,
      country: product && product.country,
      countryOfPurchase: product && product.countryOfPurchase,
      productImages: product && product.productImages.nodes,
      nutritionalInfoImages: product && product.nutritionalInfoImages.nodes,
      productComponentBases: product && product.productComponentBases.nodes,
      productFeatures: product && product.productFeatures.nodes,
      productComponentOthers: product && product.productComponentOthers.nodes,
      productCategory: product && product.productCategory,
      dietaryRestrictions: product && product.dietaryRestrictions,
      nutritionalInformation: product && product.nutritionalInformation,
      physicalState: product && product.physicalState,
      servingVessel: product && product.servingVessel,
      batchStatesCount:
        product && product.batchStates && product.batchStates.totalCount,
      defaultAttributes: product && product.defaultAttributes,
      productAttributes: product && product.productAttributes,
      productStyleName:
        product && product.productStyle && product.productStyle.name,
      productReviewsCount:
        product && product.productReviews && product.productReviews.totalCount,
      createdAt: product && product.createdAt,
      updatedAt: product && product.updatedAt,
      isPublic: product && product.public,
      prototype: product && product.prototype,
      folderId: product && product.folderId,
      selectedProductQuestions: product && product.selectedProductQuestions,
      hasTextureComponents: product && product.hasTextureComponents,
      textureComponents: product && product.textureComponents,
      allowCustomTextureComponents:
        product && product.allowCustomTextureComponents,
      panelProduct:
        product && product.panelProduct && product.panelProduct.nodes,
      ...rest
    })
  }),
  graphql(FoldersQuery, {
    options: ({ folderId }) => ({
      variables: {
        condition: {
          id: folderId
        }
      }
    }),
    props: ({ data: { folders } }) => ({
      folder:
        folders &&
        folders.nodes &&
        folders.nodes.length > 0 &&
        folders.nodes[0].name
    })
  }),
  graphql(FoldersQuery, {
    options: ({ producerId }) => ({
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }),
    name: 'folderResults'
  })
)(Product);
