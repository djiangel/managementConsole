import React from 'react';

import { useTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/styles';
import { COLORS } from '../../styles/theme';

export default function RenderSwitch(props) {
  const { input, value, boolean, ...rest } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <RadioGroup
      style={{ justifyContent: 'flex-start' }}
      {...input}
      {...rest}
      row
    >
      <FormControlLabel
        style={{ flex: 1 }}
        control={<Radio color="secondary" />}
        label={t('forms.yes')}
        value="Yes"
        classes={{ root: classes.root, label: classes.label }}
      />
      <FormControlLabel
        style={{ flex: 1 }}
        control={<Radio color="secondary" />}
        label={t('forms.no')}
        value="No"
        classes={{ root: classes.root, label: classes.label }}
      />

      {/* <FormControlLabel
        style={{ flex: 1 }}
        control={<Radio color="secondary" />}
        label={'N/A'}
        value=""
        classes={{ root: classes.root, label: classes.label }}
      /> */}
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
