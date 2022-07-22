import * as React from 'react';
import { useTranslation } from "react-i18next";

const styles = require('./SearchField.module.css');

interface SearchFieldProps {
  onChange: (e) => void;
  value: string;
  inputRef: any;
}

export const SearchField: React.FunctionComponent<SearchFieldProps> = props => {
  const {t} = useTranslation();
  return (
    <div className={styles.searchContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`} />
      <input
        id="search-field"
        type="text"
        onChange={e => props.onChange(e.target.value)}
        value={props.value}
        className={styles.searchBox}
        ref={props.inputRef}
        placeholder={t('panel.searchAddProduct')}
        autoComplete="off"
      />
    </div>
  );
};
