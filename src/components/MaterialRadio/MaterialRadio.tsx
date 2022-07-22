import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import  RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { COLORS } from '../../styles/theme';

interface Props {
  label: string;
  value: string;
  key?: string;
}

const useStyles = makeStyles({
  root: {
    marginBottom: 0
  },
  label: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: COLORS.MARINE
  }
});

const MaterialRadio: React.FunctionComponent<Props> = ({
  label,
  value,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      control={
        <Radio
          color="secondary"
          icon={<RadioButtonUnchecked fontSize="small" />}
          checkedIcon={<RadioButtonChecked fontSize="small" />}
        />
      }
      label={label}
      value={value}
      {...rest}
      classes={{root: classes.root, label: classes.label}}
    />
  );
};

export default MaterialRadio;
