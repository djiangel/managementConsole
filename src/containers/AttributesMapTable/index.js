import React from 'react';
import { isUndefined, lowerCase, reduce, upperFirst } from 'lodash';

import styles from './AttributesMapTable.module.css';
import {
  renderRaceAndEthnicity,
  renderDate,
  renderRole
} from '../UserList/userTableConfig';

type AttributesMap = { [key: string]: any };
type Props = {
  attributesMap: AttributesMap
};

function attributesArrayFromAttributesMap(attributesMap: AttributesMap) {
  return reduce(
    attributesMap,
    (aggregateAttributesArray, value, name) =>
      isUndefined(value)
        ? aggregateAttributesArray
        : [
            ...aggregateAttributesArray,
            { name: upperFirst(lowerCase(name)), value, key: name }
          ],
    []
  );
}

const AttributesMapTable = ({ attributesMap, editing = false }: Props) => (
  <table style={{ width: '100%' }}>
    <thead>
      <tr>
        <td className={styles.tableHeader}>Username</td>
        <td className={styles.tableHeader}>Email</td>
        <td className={styles.tableHeader}>Phone Number</td>
        <td className={styles.tableHeader}>DOB</td>
        <td className={styles.tableHeader}>Gender</td>
        <td className={styles.tableHeader}>First Language</td>
        <td className={styles.tableHeader}>Race/Ethnicity</td>
        <td className={styles.tableHeader}>Smoking Habits</td>
        <td className={styles.tableHeader}>Role</td>
      </tr>
    </thead>
    <tbody>
      <tr key={attributesMap.id}>
        <td className={styles.tableBody}>{attributesMap.username}</td>
        <td className={styles.tableBody}>{attributesMap.email}</td>
        <td className={styles.tableBody}>{attributesMap.phoneNumber}</td>
        <td className={styles.tableBody}>
          {renderDate(attributesMap.dateOfBirth)}
        </td>
        <td className={styles.tableBody}>{attributesMap.gender}</td>
        <td className={styles.tableBody}>{attributesMap.firstLanguage}</td>
        <td className={styles.tableBody}>
          {renderRaceAndEthnicity(attributesMap.race)}
        </td>
        <td className={styles.tableBody}>{attributesMap.smoke}</td>
        <td className={styles.tableBody}>{renderRole(attributesMap.role)}</td>
      </tr>
    </tbody>
  </table>
);

AttributesMapTable.displayName = 'AttributesMapTable';

export default AttributesMapTable;
