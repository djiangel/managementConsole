import * as React from 'react';
import CustomLexicon from './CustomLexicon';
import Paper from '@material-ui/core/Paper';

const styles = require('./CustomLexiconContainer.module.css');

export const CustomLexiconContainer: React.FunctionComponent = (props) => (
  <Paper className={styles.container}>
    <CustomLexicon {...props} />
  </Paper>
);

export default CustomLexiconContainer;
