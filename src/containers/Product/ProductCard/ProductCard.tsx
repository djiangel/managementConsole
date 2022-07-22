import * as React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { IconButton, Input, InputAdornment, Paper } from '@material-ui/core';
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  CheckCircleOutline,
  CloseOutlined,
  Search as SearchIcon
} from '@material-ui/icons';
import AllProductSearchQuery from '@graphql/queries/AllProductSearchQuery';
import { PRODUCTS } from '../../../constants/routePaths';
import RenderProductText from './RenderProductText';
import RenderProductClass from './RenderProductClass';
import RenderProductFeature from './RenderProductFeature';
import RenderProductCategory from './RenderProductCategory';
import RenderProductComponentBase from './RenderProductComponentBase';
import RenderProductComponentOther from './RenderProductComponentOther';
import RenderProductTag from './RenderProductTag';
import RenderNutritionalInfo from './RenderNutritionalInfo';
import RenderAttributes from './RenderAttributes';
import RenderProductCountry from './RenderProductCountry';
import RenderProductInfo from './RenderProductInfo';
import RenderProductThumbnail from './RenderProductThumbnail';
import RenderProductFolder from './RenderProductFolder';
import { getMainImageUrl } from '../helper';
import { WithTranslation, withTranslation } from 'react-i18next';
import FormSectionHeader from 'components/FormSectionHeader';
import MaterialButton from 'components/MaterialButton';
import formatPath from '../../../utils/formatPath';
import { PRODUCT } from '../../../constants/routePaths';
import { event } from 'react-ga';
import { CAT_PRODUCT } from 'constants/googleAnalytics/categories';
import { PRODUCT_EDIT_OPEN } from 'constants/googleAnalytics/actions';

const styles = require('./ProductCard.module.css');

interface Props {
  name: string;
  localName?: string;
  defaultAttributes?: object;
  ingredients?: string;
  dietaryRestrictions: string;
  country?: string;
  countryOfPurchase?: string;
  brand: string;
  servingVessel?: string;
  physicalState?: string;
  nutritionalInformation?: object;
  productAttributes?: object;
  productTags?: any[];
  oldProductClass?: string;
  productClasses?: object[];
  productImages?: object;
  nutritionalInfoImages?: string;
  isPublic?: boolean;
  prototype?: boolean;
  aroma?: boolean;
  id?: number;
  folder?: object;
  folderId?: number;
  folderResults?: object;
  toggleEdit: (event) => void;
  locationState: string;
  productFeatures: any;
  productCategory: any[];
  productComponentBases: any;
  productComponentOthers: any[];
  panelProduct: any[];
}

class ProductCard extends React.Component<Props & WithTranslation> {
  state = {
    addingFolder: false,
    searchString: ''
  };

  setAddingFolder = val => this.setState({ addingFolder: val });

  render() {
    const {
      name,
      localName,
      defaultAttributes,
      ingredients,
      dietaryRestrictions,
      country,
      countryOfPurchase,
      brand,
      physicalState,
      nutritionalInformation,
      productAttributes,
      productFeatures,
      productCategory,
      productComponentBases,
      productComponentOthers,
      productImages,
      nutritionalInfoImages,
      isPublic,
      aroma,
      prototype,
      id,
      folder,
      folderId,
      folderResults,
      toggleEdit,
      locationState,
      panelProduct,
      t
    } = this.props;

    const { searchString } = this.state;

    const images = []
      .concat(productImages && productImages)
      .concat(nutritionalInfoImages && nutritionalInfoImages);

    return (
      <Paper className={styles.container}>
        <div className={styles.headerContainer}>
          <div>
            <div className={styles.headerTextContainer}>
              <IconButton
                component={Link}
                to={{ pathname: PRODUCTS, state: locationState }}
                size="small"
                style={{ marginLeft: -26 }}
              >
                <KeyboardBackspaceIcon fontSize="small" />
                <h5 className={styles.productHeader}>Products</h5>
              </IconButton>
            </div>
            <h3 className={styles.productFieldsTitle}>{name}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Input
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
              onChange={e => this.setState({ searchString: e.target.value })}
              placeholder={t('general.search')}
            />
            {searchString.length > 0 && (
              <Query
                query={AllProductSearchQuery}
                variables={{ query: searchString }}
              >
                {({ data: { productResults } }) => (
                  <Paper className={styles.searchResultsContainer}>
                    {productResults &&
                      productResults.nodes.map((product, index, products) => (
                        <div className={styles.searchResult}>
                          <Link
                            to={{
                              pathname: formatPath(PRODUCT, {
                                productId: product.id
                              })
                            }}
                            className={styles.searchResultText}
                            style={{
                              borderBottom:
                                index < products.length - 1
                                  ? 'var(--pale-grey) 2px solid'
                                  : 0
                            }}
                          >
                            {product.name}
                          </Link>
                        </div>
                      ))}
                  </Paper>
                )}
              </Query>
            )}
          </div>
        </div>
        <div className={styles.imageContainer}>
          {images.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                className={styles.productImage}
                src={getMainImageUrl(images)}
                alt="main-image"
              />
              <RenderProductThumbnail
                imageUrls={images.map(image => image.url)}
              />
            </div>
          ) : (
            <div />
          )}
          <div className={styles.headerActionContainer}>
            <RenderProductFolder
              folderResults={folderResults}
              folderId={folderId}
              folder={folder}
              addingFolder={this.state.addingFolder}
              setAddingFolder={this.setAddingFolder}
              productId={id}
            />
            <MaterialButton
              onClick={e => {
                toggleEdit(e);
                event({
                  category: CAT_PRODUCT,
                  action: PRODUCT_EDIT_OPEN,
                  label: id.toString()
                });
              }}
              variant="outlined"
              soft
              teal
              style={{ width: 140, marginTop: 20 }}
            >
              Edit Product
            </MaterialButton>
          </div>
        </div>
        <div className={styles.productInfoTable}>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.productName')} />
                    {!!name ? (
                      <span className={styles.infoContent}>
                        {name}
                        {localName && ` (${localName})`}
                      </span>
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.productBrand')} />
                    {!!brand ? (
                      <span className={styles.infoContent}>{brand}</span>
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.attributes')} />
                    <RenderAttributes
                      defaultAttributes={defaultAttributes}
                      productAttributes={productAttributes}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.productCategory')} />
                    {!!productCategory ? (
                      <RenderProductCategory
                        productCategory={productCategory}
                      />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.productFeature')} />
                    {productFeatures != '' ? (
                      <RenderProductFeature productFeatures={productFeatures} />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader
                      text={t('product.productComponentBase')}
                    />
                    {productComponentBases != '' ? (
                      <RenderProductComponentBase
                        productComponentBases={productComponentBases}
                      />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader
                      text={t('product.productComponentOther')}
                    />
                    <RenderProductComponentOther
                      productComponentOthers={productComponentOthers}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.ingredients')} />
                    <RenderProductText property={ingredients} />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader
                      text={t('product.dietaryRestrictions')}
                    />
                    {!!dietaryRestrictions ? (
                      <RenderProductInfo
                        value={dietaryRestrictions}
                        property="allergenInfo"
                      />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.nutritionalInfo')} />
                    <RenderNutritionalInfo
                      nutritionalInfo={nutritionalInformation}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                {/* <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.servingVessel')} />
                    <RenderProductInfo
                      property="servingVessel"
                      value={servingVessel}
                    />
                  </div>
                </td> */}
                <td colSpan={2}>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.physicalState')} />
                    {!!physicalState ? (
                      <RenderProductInfo
                        property="physicalState"
                        value={physicalState}
                      />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.countryOfOrigin')} />
                    {!!country ? (
                      <RenderProductCountry countryCode={country} />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.infoContainer}>
                    <FormSectionHeader text={t('product.countryOfPurchase')} />
                    {!!countryOfPurchase ? (
                      <RenderProductCountry countryCode={countryOfPurchase} />
                    ) : (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={styles.infoContainerSmall}>
                    <FormSectionHeader text={t('product.publicProduct')} />
                    <span className={styles.infoContent}>
                      {isPublic ? (
                        <CheckCircleOutline color="secondary" />
                      ) : (
                        <CloseOutlined color="error" />
                      )}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={styles.infoContainerSmall}>
                    <FormSectionHeader text={t('product.prototypeProduct')} />
                    {prototype === null ? (
                      <span className={styles.requiredField}>
                        {t('product.required')}
                      </span>
                    ) : (
                      <span className={styles.infoContent}>
                        {prototype ? (
                          <CheckCircleOutline color="secondary" />
                        ) : (
                          <CloseOutlined color="error" />
                        )}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.infoContainerSmall}>
                    <FormSectionHeader text={t('product.aroma')} />
                    <span className={styles.infoContent}>
                      {aroma ? (
                        <CheckCircleOutline color="secondary" />
                      ) : (
                        <CloseOutlined color="error" />
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className={styles.dateTable}>
            <thead className={styles.dateTableHead}>
              <tr>
                <th>Production Date</th>
                <th>Expiration Date</th>
                <th>Panel</th>
              </tr>
            </thead>
            <tbody className={styles.dateTableBody}>
              {panelProduct.length > 0 ? (
                panelProduct.map(item => (
                  <tr>
                    <td>{item.expirationDate || 'No data available'}</td>
                    <td>{item.expirationDate || 'No data available'}</td>
                    <td>{item.panel.pin}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No Data Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>
    );
  }
}

export default withTranslation()(ProductCard);
