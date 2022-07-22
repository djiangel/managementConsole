import * as React from 'react';

const styles = require('./FormSectionHeader.module.css');

interface Props {
  text: string;
}

const FormSectionHeader: React.FunctionComponent<Props> = ({ text }) => (
  <span className={styles.container}>{text}</span>
);

export default FormSectionHeader;
