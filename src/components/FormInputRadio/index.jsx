import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '../../material/index';
import { COLORS } from '../../styles/theme';

export default function RenderSwitch(props) {
  const { input, value, boolean, options, ...rest } = props;
  const classes = useStyles();

  return (
    <RadioGroup
      style={{ justifyContent: 'flex-start' }}
      {...input}
      {...rest}
      row
    >
      {options.map(option => (
        <FormControlLabel
          style={{ flex: 1 }}
          control={<Radio color="secondary" />}
          label={option.label}
          value={option.value}
          classes={{ root: classes.root, label: classes.label }}
        />
      ))}
    </RadioGroup>
  );
}

const useStyles = makeStyles({
  root: {
    marginBottom: 0
  },
  label: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: COLORS.MARINE
  }
});
