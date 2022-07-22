import React from 'react';
import styles from './FormInputTag.module.css';

const crossStr = String.fromCharCode(215);

const RemoveComponent = props => {
  const { readOnly, onClick, className } = props;
  if (readOnly) {
    return <span />;
  }

  return (
    <a onClick={onClick} className={className} onKeyDown={onClick}>
      {crossStr}
    </a>
  );
};

const Tag = props => {
  const { readOnly, label } = props;
  return (
    <span className={styles.tagContainer}>
      {label}
      <RemoveComponent
        tag={props.tag}
        className={styles.remove}
        onClick={props.onDelete}
        readOnly={readOnly}
      />
    </span>
  );
};
export default Tag;
