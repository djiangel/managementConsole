import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from '../Report.module.css';
import Tag from '../../../components/FormInputTag/Tag';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import ProductNameByIdQuery from '../../../graphql/queries/ProductNameByIdQuery';

export default function MarketSurvey({ products, reanamedProducts }) {
  const { t } = useTranslation();

  const productNames = products.map(id =>
    useQuery(ProductNameByIdQuery, {
      variables: {
        id: parseInt(id)
      }
    })
  );

  const RenamedProductComponent = ({ prod }) => {
    let id_index = reanamedProducts.product_id.indexOf(prod.product.id);
    if (id_index > -1) {
      return (
        <Tag
          key={prod.product.id}
          readOnly
          label={`${prod.product.name +
            ' - ' +
            reanamedProducts.new_product[id_index]}`}
        />
      );
    } else {
      return <Tag key={prod.product.id} readOnly label={prod.product.name} />;
    }
  };

  return (
    <div>
      <div className={styles.sectionContainer}>
        <span className={styles.sectionHeader}>
          {t('reports.competitiveSet')}
        </span>
      </div>

      <div className={styles.competitiveSetTable}>
        <table>
          <tbody>
            <tr style={!products.length ? { height: '100px' } : undefined}>
              <td>
                <div className={styles.tag}>
                  {productNames.map(
                    product =>
                      !product.loading &&
                      product.data && (
                        <RenamedProductComponent prod={product.data} />
                      )
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>*Name - Alternate Name</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
