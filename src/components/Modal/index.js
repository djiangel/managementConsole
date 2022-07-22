import React from 'react';
import Button from '../Button';
import MaterialButton from '../MaterialButton';

import styles from './modal.module.css';

class Modal extends React.Component {
  render() {
    const {
      open,
      onClose,
      title,
      primaryAction,
      children,
      styledTitle,
      modalStyle,
      cancelContent
    } = this.props;

    if (!open) {
      return null;
    }

    return (
      <div className={styles.shadow}>
        <div className={modalStyle ? styles.modalStyle : styles.modalContainer}>
          {styledTitle && styledTitle}
          <h1>{!styledTitle && title}</h1>
          <div className={styles.contentContainer}>{children}</div>
          {modalStyle ? (
            <div className={styles.footer}>
              <MaterialButton variant="outlined" soft onClick={onClose}>
                {cancelContent ? cancelContent : 'Cancel'}
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                soft
                teal
                onClick={primaryAction.action}
                disabled={primaryAction.disabled}
              >
                {primaryAction.content}
              </MaterialButton>
            </div>
          ) : (
            <div className={styles.footer}>
              <MaterialButton variant="outlined" soft onClick={onClose}>
                {cancelContent ? cancelContent : 'Cancel'}
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                soft
                teal
                onClick={primaryAction.action}
                disabled={primaryAction.disabled}
              >
                {primaryAction.content}
              </MaterialButton>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Modal;
