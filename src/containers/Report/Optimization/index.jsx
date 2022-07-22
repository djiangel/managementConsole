import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Report.module.css';
import Tag from '../../../components/FormInputTag/Tag';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import ProductNameByIdQuery from '../../../graphql/queries/ProductNameByIdQuery';

export default function Optimization({
  products,
  constraintLevel,
  gravityConstraint,
  newReferenceFlavor
}) {
  const { t } = useTranslation();

  const constraintLevelOptions = t('constraintLevelOptions', {
    returnObjects: true
  });

  const gravityConstraintOptions = t('gravityConstraintOptions', {
    returnObjects: true
  });
  const translatedGravityConstraint =
    gravityConstraint &&
    gravityConstraint.map(
      gc =>
        gravityConstraintOptions.find(
          opt => opt.value.toLowerCase() === gc.toLowerCase()
        ).label
    );

  const productNames = products.map(id =>
    useQuery(ProductNameByIdQuery, {
      variables: {
        id: parseInt(id)
      }
    })
  );

  return (
    <div>
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
                  {t('reports.products')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                {productNames ? (
                  <div className={styles.tag}>
                    {productNames.map(
                      product =>
                        !product.loading &&
                        product.data && (
                          <Tag
                            key={product.data.product.id}
                            readOnly
                            label={product.data.product.name}
                          />
                        )
                    )}
                  </div>
                ) : (
                  <span>{t('reports.noProducts')}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.constraintLevel')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  <span>{constraintLevel}</span>
                </div>
              </td>
            </tr>
            {/* <tr style={{ alignItems: 'center' }}>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.gravityConstraint')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <div className={styles.tag}>
                  {translatedGravityConstraint ? (
                    translatedGravityConstraint.map(level => (
                      <Tag readOnly={true} label={level} key={level} />
                    ))
                  ) : (
                      <span>-</span>
                    )}
                </div>
              </td>
            </tr> */}
            <tr>
              <td className={styles.fieldColumn}>
                <span className={styles.fieldsLabel}>
                  {t('reports.newReferenceFlavors')}
                </span>
              </td>
              <td className={styles.valueColumn}>
                <span>
                  {newReferenceFlavor ? t('forms.yes') : t('forms.no')}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
