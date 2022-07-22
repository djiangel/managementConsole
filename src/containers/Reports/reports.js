import React from 'react';
import styles from './Reports.module.css';

import LayoutGroup from '../../components/LayoutGroup';
import LayoutSectionHeader from '../../components/LayoutSectionHeader';
import LayoutMetricsGroup from '../../components/LayoutMetricsGroup';
import { useTranslation } from 'react-i18next';

import OtherTest from '../../components/Nivo/OtherTest';

// const Reports = () => {
//   return (
//     <OtherTest />
//   );
// };

// export default Reports;

const PanelistStats = ({ products, userId, name }) => {
  const { t } = useTranslation();
  return (
    <div key={userId} className={styles.table}>
      <h2 className={styles.username}>{name}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('product.productName')}</th>
            <th>{t('reports.noOfReview')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr className={styles.row} key={p.name}>
              <td>{p.name}</td>
              <td>{p.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Reports = ({ loading, error, productMap, userMap, reviewMap }) => {
  const { t } = useTranslation();
  const rows = [];

  Object.keys(reviewMap).forEach(userId => {
    const products = [];
    Object.keys(reviewMap[userId]).forEach(productId => {
      products.push({
        name: productMap[productId],
        count: reviewMap[userId][productId]
      });
    });

    rows.push(
      <PanelistStats
        key={userId}
        products={products}
        userId={userId}
        name={userMap[userId]}
      />
    );
  });

  return (
    <LayoutGroup title="">
      {/* <LayoutSectionHeader>{t('reports.header')}</LayoutSectionHeader> */}
      <LayoutSectionHeader>TEST</LayoutSectionHeader>
      <LayoutMetricsGroup>
        <div>{rows}</div>
      </LayoutMetricsGroup>
    </LayoutGroup>
  );
};

export default Reports;
