import React from 'react';

import styles from './CustomLexiconModal.module.css';

class Modal extends React.Component {
  render() {
    const { open, title, children, styledTitle, modalStyle } = this.props;

    if (!open) {
      return null;
    }

    return (
      <div className={styles.shadow}>
        <div className={modalStyle ? styles.modalStyle : styles.modalContainer}>
          <h1>{!styledTitle && title}</h1>
          <div className={styles.contentContainer}>{children}</div>
        </div>
      </div>
    );
  }
}

export default Modal;
