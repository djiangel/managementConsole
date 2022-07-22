import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../RequestReport.module.css';
import { Field } from 'redux-form';
import { Input, InputAdornment, Grid, Modal } from '../../../material/index';
import { Search as SearchIcon } from '@material-ui/icons';
import ProductSearch from '../../../components/ProductSearch';
import AllProductSearch from '../../../components/AllProductSearch';
import Tag from '../../../components/FormInputTag/Tag';
import { union, unionBy } from 'lodash';
import FieldFolderSelect from '../../../components/FieldFolderSelect';
import { useQuery } from 'react-apollo-hooks';
import FoldersQuery from '../../../graphql/queries/FoldersQuery';
import MaterialButton from '../../../components/MaterialButton';
import FolderProducts from './FolderProducts';
import CompetitiveProduct from './CompetitiveProduct';
import { MARKET_SURVEY, PRODUCT } from '../../../constants/report';
import FieldCheckBox from '../../../components/FieldCheckBox';
import FieldTextInput from '../../../components/FieldTextInput';

export default function MarketSurvey({
  products,
  change,
  displayMode,
  producerId,
  folders,
  folder,
  folderProducts,
  type
}) {
  const { t } = useTranslation();

  const [searchString, setSearchString] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showBlindNameField, setShowBlindNameField] = useState(false);
  const [newProducts, setNewProduct] = useState(products);
  const [renameProducts, setRenameProducts] = useState(false);

  const handleVisibilityChange = id => {
    const updatedProducts = [...newProducts];
    const visibility = updatedProducts.filter(prod => prod.id === id)[0][
      'visible'
    ];
    updatedProducts.filter(prod => prod.id === id)[0]['visible'] = !visibility;
    setNewProduct(updatedProducts);
  };

  const handleAllProdVisibilityChange = () => {
    const updatedProducts = [...newProducts];
    updatedProducts.forEach(prod => {
      prod['visible'] = !renameProducts;
    });
    change('products', updatedProducts);
    setNewProduct(updatedProducts);
    setRenameProducts(!renameProducts);
  };

  const handleNameChange = (id, val) => {
    const updatedProducts = [...newProducts];
    updatedProducts.filter(prod => prod.id === id)[0]['rename'] = val;
    change('products', updatedProducts);
    setNewProduct(updatedProducts);
  };

  const { data: folderOptionsData, loading, ...foldersOption } = useQuery(
    FoldersQuery,
    {
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }
  );
  const addProduct = newProduct => {
    if (newProduct.reviews > 5) {
      if (products.length && type.value === PRODUCT) {
        setShowWarning(true);
      } else {
        var repeatFlag = false;

        products.map(product => {
          if (product.id == [newProduct][0].id) {
            repeatFlag = true;
          }
        });
        Object.keys(newProduct).map(function(key, index) {
          newProduct['visible'] = false;
          newProduct['rename'] = '';
        });
        if (!repeatFlag) {
          change('products', union(products, [newProduct]));
          setNewProduct([...newProducts, { ...newProduct }]);
        }
      }
      setShowSearch(false);
      setSearchString('');
    } else {
      setErrorModal(true);
    }
  };

  const deleteProduct = productId => {
    setNewProduct([...newProducts].filter(product => product.id !== productId));
    change('products', products.filter(product => product.id !== productId));
    showWarning && setShowWarning(false);
  };

  const handleChange = string => {
    setSearchString(string);
    setShowSearch(true);
  };

  const addFolder = () => {
    change('folders', union(folders, [folder]));
    setShowFolders(false);
  };

  const removeFolder = folderId => {
    change('folders', folders.filter(f => f !== folderId));
  };

  return (
    <div>
      {!displayMode && (
        <div>
          <h5 className={styles.productHeader}>{t('navigation.reports')}</h5>
          <h3 className={styles.productFieldsTitle}>
            {`${t('reports.createReportRequest')}: ${
              type.value === MARKET_SURVEY
                ? t('reports.marketSurvey')
                : t('reports.productReport')
            }`}
          </h3>

          <Modal
            open={showFolders}
            onClose={() => setShowFolders(false)}
            className={styles.folderModal}
          >
            <div className={styles.modalContainer}>
              <Field
                component={FieldFolderSelect}
                key="folder"
                name="folder"
                folderResults={folderOptionsData}
                label="Folder"
              />
              <div className={styles.buttonContainer}>
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={() => setShowFolders(false)}
                >
                  {t('general.cancel')}
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  soft
                  teal
                  onClick={addFolder}
                  disabled={!folder || folder === 0}
                >
                  {t('reports.importFolder')}
                </MaterialButton>
              </div>
            </div>
          </Modal>

          <Modal
            open={showErrorModal}
            onClose={() => setErrorModal(false)}
            className={styles.folderModal}
          >
            <div className={styles.modalContainer}>
              <div className={styles.errorTitle}>{t('reports.error')}</div>
              <div className={styles.errorMessage}>
                {t('reports.insufficientData')}
              </div>
              <div className={styles.buttonContainer}>
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={() => setErrorModal(false)}
                >
                  {t('general.cancel')}
                </MaterialButton>
              </div>
            </div>
          </Modal>

          <Grid container spacing={3}>
            <Grid item xs={8}>
              {!showWarning ? (
                <Input
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  }
                  value={searchString}
                  onChange={event => handleChange(event.target.value)}
                  placeholder={t('panel.searchProduct')}
                  className={styles.searchBar}
                  fullWidth
                />
              ) : (
                <h5 className={styles.limitOne}>
                  {t('reports.productLimitWarning')}
                </h5>
              )}
            </Grid>
            {type.value === MARKET_SURVEY && (
              <Grid item xs={4}>
                <MaterialButton
                  variant="outlined"
                  soft
                  onClick={() => setShowFolders(true)}
                >
                  {t('reports.importFolder')}
                </MaterialButton>
              </Grid>
            )}
          </Grid>

          {searchString.length > 0 &&
            showSearch &&
            producerId === 25 && (
              <AllProductSearch
                query={searchString}
                hideSearch={() => setShowSearch(false)}
                first={10}
                onClick={addProduct}
              />
            )}
          {searchString.length > 0 &&
            showSearch &&
            producerId !== 25 && (
              <ProductSearch
                query={searchString}
                hideSearch={() => setShowSearch(false)}
                first={10}
                onClick={addProduct}
              />
            )}
        </div>
      )}

      <div className={styles.sectionContainer}>
        <span className={styles.sectionHeader}>
          {t('reports.competitiveSet')}
        </span>
      </div>

      <div className={styles.competitiveProductTable}>
        <div>
          {/* style={!products.length ? { height: '100px' } : undefined} */}
          <div className={styles.tag}>
            <table style={{ border: 0 }}>
              <tr>
                <th
                  style={{ paddingLeft: 5, verticalAlign: 'top' }}
                  className={styles.colName}
                >
                  Name
                </th>
                <th
                  style={{ verticalAlign: 'top' }}
                  className={styles.colRename}
                >
                  Alternate Name
                </th>
                <th className={styles.colCheck}>
                  <span>
                    <Field
                      name="allProductRename"
                      component={FieldCheckBox}
                      val={renameProducts}
                      name="allProdVisible"
                      label="Select All"
                      onChange={() => {
                        handleAllProdVisibilityChange();
                      }}
                    />
                  </span>
                </th>
              </tr>
              {newProducts.map(product => (
                <CompetitiveProduct
                  product={product}
                  deleteProduct={deleteProduct}
                  displayMode={displayMode}
                  showBlindNameField={showBlindNameField}
                  handleVisibilityChange={handleVisibilityChange}
                  handleNameChange={handleNameChange}
                />
              ))}
            </table>
          </div>
        </div>
      </div>

      {!loading &&
        folders.map(folder => (
          <FolderProducts
            folder={folder}
            folderName={
              folderOptionsData.folders.nodes.find(data => data.id === folder)
                .name
            }
            removeFolder={() => removeFolder(folder)}
            displayMode={displayMode}
            folderProducts={folderProducts}
            change={change}
          />
        ))}
    </div>
  );
}
