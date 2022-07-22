import React, { Component } from 'react';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import EditProduct from './EditProduct';
import ProductDeleteDialog from './ProductDeleteDialog';
import ActivityIndicator from '../../components/ActivityIndicator';
import ProductCard from './ProductCard';
import { isNestedObject, toNewProductAttribute } from './helper';
import { trim } from 'lodash';

import styles from './product.module.css';
import NotFoundContainer from '../NotFound';

const dateFormat = 'MMM dd, yyyy';

function getFormattedNutritionalInfoObject(object) {
  if (!object) {
    return {};
  }

  const units = {};

  // default
  Object.keys(object).forEach(key => {
    if (key !== 'additional' && !key.includes('_unit')) {
      const splits = String(object[key]).match(/^(\D?\d+(?:\.\d+)?)(\s?\w+$)?/);
      units[key] = splits[1];
      let unit = splits[2] && trim(splits[2]);
      units[key + '_unit'] = {
        label: unit,
        value: unit
      };
    }
  });

  // additional
  if (object.additional) {
    units.additional = object.additional.map(att => {
      const splits = att.value.match(/^(\D?\d+(?:\.\d+)?)(\s?\w+$)?/);
      return {
        key: att.key,
        value: splits[1],
        unit: splits[2] && trim(splits[2])
      };
    });
  }

  return units;
}

export default class ProductContainer extends Component {
  state = {
    editing: false,
    showDeleteModal: false
  };

  toggleEdit = () => {
    this.setState({
      editing: !this.state.editing
    });
  };

  toggleDeleteModal = () =>
    this.setState({ showDeleteModal: !this.state.showDeleteModal });

  render() {
    const {
      loading,
      createdAt,
      updatedAt,
      id,
      productProducerId,
      producerId,
      name,
      localName,
      defaultAttributes,
      ingredients,
      dietaryRestrictions,
      country,
      countryOfPurchase,
      brand,
      servingVessel,
      physicalState,
      nutritionalInformation,
      productAttributes,
      productCategory,
      productFeatures,
      productComponentBases,
      productComponentOthers,
      oldProductClass,
      productImages,
      nutritionalInfoImages,
      isPublic,
      aroma,
      prototype,
      folder,
      folderId,
      folderResults,
      productStyleName,
      handleDeleteProduct,
      location,
      selectedProductQuestions,
      t,
      hasTextureComponents,
      textureComponents,
      allowCustomTextureComponents,
      panelProduct
    } = this.props;

    const { editing, showDeleteModal } = this.state;

    if (loading) {
      return <ActivityIndicator />;
    }

    if (productProducerId !== producerId) {
      return <NotFoundContainer />;
    }

    return (
      <div>
        {!editing ? (
          <ProductCard
            toggleEdit={this.toggleEdit}
            id={id}
            name={name}
            localName={localName}
            defaultAttributes={
              defaultAttributes && isNestedObject(defaultAttributes)
                ? defaultAttributes
                : null
            }
            ingredients={ingredients}
            dietaryRestrictions={dietaryRestrictions}
            country={country}
            countryOfPurchase={countryOfPurchase}
            brand={brand}
            aroma={aroma}
            servingVessel={servingVessel}
            physicalState={physicalState}
            nutritionalInformation={nutritionalInformation}
            productAttributes={
              !productAttributes && !isNestedObject(defaultAttributes)
                ? toNewProductAttribute(defaultAttributes)
                : productAttributes
            }
            productCategory={productCategory}
            productFeatures={productFeatures}
            productComponentBases={productComponentBases}
            productComponentOthers={productComponentOthers}
            oldProductClass={oldProductClass}
            productImages={productImages}
            isPublic={isPublic}
            prototype={prototype}
            folder={folder}
            folderId={folderId}
            folderResults={folderResults}
            nutritionalInfoImages={nutritionalInfoImages}
            locationState={location.state}
            panelProduct={panelProduct}
          />
        ) : (
          <div>
            {/* <div className={styles.container}>
              <div>
                <h1>{name}</h1>
                <h2>{productStyleName}</h2>
                <h3>
                  {t('general.dateCreated')}{' '}
                  {formatDate(parseISO(createdAt), dateFormat)}
                </h3>
                <h3>
                  {t('general.dateUpdated')}{' '}
                  {formatDate(parseISO(updatedAt), dateFormat)}
                </h3>
              </div>
            </div> */}
            <EditProduct
              id={id}
              name={name}
              createdAt={createdAt}
              updatedAt={updatedAt}
              localName={localName}
              brand={brand}
              ingredients={ingredients}
              dietaryRestrictions={dietaryRestrictions}
              servingVessel={servingVessel}
              productCategory={productCategory}
              productFeatures={productFeatures}
              productComponentBases={productComponentBases}
              productComponentOthers={productComponentOthers}
              physicalState={physicalState}
              defaultAttributes={
                // default attributes not shown if it's the old product attribute
                defaultAttributes && isNestedObject(defaultAttributes)
                  ? defaultAttributes
                  : null
              }
              productAttributes={
                // uses old product attributes if it exists
                !productAttributes && !isNestedObject(defaultAttributes)
                  ? toNewProductAttribute(defaultAttributes)
                  : productAttributes
              }
              nutritionalInfo={getFormattedNutritionalInfoObject(
                nutritionalInformation
              )}
              productImages={productImages}
              nutritionalInfoImages={nutritionalInfoImages}
              country={country}
              countryOfPurchase={countryOfPurchase}
              public={isPublic}
              prototype={prototype}
              aroma={aroma}
              folder={folderId}
              selectedProductQuestions={selectedProductQuestions}
              toggleEdit={this.toggleEdit}
              toggleDelete={this.toggleDeleteModal}
              hasTextureComponents={hasTextureComponents}
              allowCustomTextureComponents={allowCustomTextureComponents}
              textureComponents={textureComponents}
            />
          </div>
        )}
        <ProductDeleteDialog
          open={showDeleteModal}
          toggleDialog={this.toggleDeleteModal}
          productId={id}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>
    );
  }
}
