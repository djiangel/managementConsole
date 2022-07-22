import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/styles';
import { COLORS } from '../../styles/theme';
import { useTranslation } from "react-i18next";

interface Props {
  input: any;
  options: any[];
}

const RenderRadioButtonCreatable: React.FunctionComponent<Props> = ({
  input,
  options
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  return (
    <RadioGroup {...input} row>
      {options.map((option, index) => (
        <FormControlLabel
          control={<Radio color="secondary" />}
          label={option.label}
          value={option.value}
          key={`${index}_${option.value}`}
          classes={{ root: classes.root, label: classes.label }}
        />
      ))}
      <FormControlLabel
        control={<Radio color="secondary" />}
        label={t('forms.other')}
        value="Others"
        classes={{ root: classes.root, label: classes.label }}
      />
    </RadioGroup>
  );
};

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

export default RenderRadioButtonCreatable;
