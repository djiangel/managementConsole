import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '../../material/index';

const useStyles = makeStyles({
  root: {
    width: '95%',
    maxWidth: '80%',
    padding: '4.2rem 3.2rem'
  }
});

const LoadingScreen: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <LinearProgress color="secondary" />
    </Paper>
  );
};

export default LoadingScreen;
