import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styles from '../RequestReport.module.css';
import {
  Input,
  InputAdornment,
  Grid,
  Modal,
  IconButton
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import ProductSearch from '../../../components/ProductSearch';
import Tag from '../../../components/FormInputTag/Tag';
import { union } from 'lodash';
import RenderSwitch from '../../../components/ProductClassAttributesInput/RenderSwitch';
import InfoIcon from '@material-ui/icons/Info';
import FormInput from '../../../components/FormInput';
import FormInputSelect from '../../../components/FormInputSelect';
import MaterialButton from '../../../components/MaterialButton';

export default function Optimization({
  products,
  change,
  displayMode,
  ...values
}) {
  const { t } = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showConstraintDesc, setShowConstraintDesc] = useState(false);
  const [showGravityDesc, setShowGravityDesc] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);

  const addProduct = newProduct => {
    if (newProduct.reviews > 5) {
      var repeatFlag = false;

      products.map(product => {
        if (product.id == [newProduct][0].id) {
          repeatFlag = true;
        }
      });

      if (!repeatFlag) {
        change('products', union(products, [newProduct]));
      }

      setShowSearch(false);
    } else {
      setErrorModal(true);
    }
  };

  const deleteProduct = productId => {
    change('products', products.filter(product => product.id !== productId));
  };

  const handleChange = string => {
    setSearchString(string);
    setShowSearch(true);
  };

  return (
    <div>
      {!displayMode && (
        <div>
          <h5 className={styles.productHeader}>{t('navigation.reports')}</h5>
          <h3 className={styles.productFieldsTitle}>
            {`${t('reports.createReportRequest')}: ${t(
              'reports.optimization'
            )}`}
          </h3>

          <Modal
            open={showConstraintDesc}
            onClose={() => setShowConstraintDesc(false)}
            className={styles.folderModal}
          >
            <div className={styles.modalContainer}>
              <h3>Constraint Level Description</h3>
              <p>
                Constraint Level defines the distance the AI is allowed to
                explore from the starting profile or concept. A high constraint
                yields a smaller distance, and the resulting optimization will
                be more similar to the starting profile or concept. In reverse,
                a low constraint yields a larger search and will likely (but not
                definitely) produce a more unique profile with a greater level
                of differentiation from the starting profile or concept.
              </p>
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

          <Modal
            open={showGravityDesc}
            onClose={() => setShowGravityDesc(false)}
            className={styles.folderModal}
          >
            <div className={styles.modalContainer}>
              <h3>Title</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                posuere nec felis egestas fringilla. Ut non vestibulum mi. Fusce
                ut quam in arcu elementum bibendum. Etiam pharetra viverra nisi
                eu euismod. Morbi diam urna, condimentum ac sollicitudin vitae,
                ornare eget nulla. Integer ac nulla in tortor sollicitudin
                tempus. Aliquam imperdiet elementum enim vitae ultrices. Duis
                eget velit et ipsum vehicula consequat quis quis urna. Interdum
                et malesuada fames ac ante ipsum primis in faucibus. Aenean ac
                ligula nec dolor ultricies elementum vel non velit.
              </p>
            </div>
          </Modal>

          <Grid container>
            <Grid item xs={8}>
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
            </Grid>
          </Grid>

          {searchString.length > 0 &&
            showSearch && (
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
          {t('reports.productsToOptimize')}
        </span>
      </div>

      <div className={styles.competitiveSetTable}>
        <table>
          <tbody>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.product')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                {products.length ? (
                  <div className={styles.tag}>
                    {products.map(product => (
                      <div key={product.id}>
                        <Tag
                          readOnly={displayMode}
                          label={product.name}
                          onDelete={() => deleteProduct(product.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : displayMode ? (
                  <span>No Products</span>
                ) : (
                  <span className={styles.productsPlaceholder}>
                    {t('reports.productsPlaceholder')}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.constraintLevel')}
                </span>
                <IconButton onClick={() => setShowConstraintDesc(true)}>
                  <InfoIcon color="primary" />
                </IconButton>
              </td>
              <td className={styles.valueColumn}>
                {displayMode ? (
                  <div className={styles.tag}>
                    {/* {values.constraintLevel &&
                      values.constraintLevel.map(level => (
                        <div key={level.label}>
                          <Tag readOnly={true} label={level.label} />
                        </div>
                      ))} */}
                    {values.constraintLevel.label}
                  </div>
                ) : (
                  <Field
                    name="constraintLevel"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    key="constraintLevel"
                    options={t('constraintLevelOptions', {
                      returnObjects: true
                    })}
                    isSearchable
                    isClearable
                    placeholder={t('reports.constraintLevelPlaceholder')}
                    checkbox
                  />
                )}
              </td>
            </tr>
            {/* <tr style={{ alignItems: 'center' }}>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.gravityConstraint')}
                </span>
                <IconButton onClick={() => setShowGravityDesc(true)}>
                  <InfoIcon color="primary" />
                </IconButton>
              </td>
              <td className={styles.valueColumn}>
                {displayMode ? (
                  <div className={styles.tag}>
                    {values.gravityConstraint &&
                      values.gravityConstraint.map(level => (
                        <div key={level.label}>
                          <Tag readOnly={true} label={level.label} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <Field
                    name="gravityConstraint"
                    component={FormInput}
                    inputComponent={FormInputSelect}
                    key="gravityConstraint"
                    options={t('gravityConstraintOptions', {
                      returnObjects: true
                    })}
                    isSearchable
                    isClearable
                    placeholder={t('reports.gravityConstraintPlaceholder')}
                    checkbox
                    isMulti
                  />
                )}
              </td>
            </tr> */}
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.newReferenceFlavors')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                {displayMode ? (
                  <span>{values.newReferenceFlavor ? 'Yes' : 'No'}</span>
                ) : (
                  <Field
                    name="newReferenceFlavors"
                    component={RenderSwitch}
                    key="newReferenceFlavors"
                    required
                    parse={value => (value === 'Yes' ? true : false)}
                    format={value =>
                      value ? 'Yes' : value === false ? 'No' : ''
                    }
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
