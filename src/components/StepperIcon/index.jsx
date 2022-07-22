import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';

const StepperIcon = props => {
  const { active, completed } = props;
  const styles = makeStyles({
    root: {
      color: 'gray'
    },
    active: {
      color: 'var(--aqua-marine)'
    }
  });
  const classes = styles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      <RadioButtonChecked />
    </div>
  );
};

export default StepperIcon;
