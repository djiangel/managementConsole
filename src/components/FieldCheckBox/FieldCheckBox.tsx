import * as React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import useStyles from "components/FieldCheckBox/useStyles";

const styles = require('./FieldCheckBox.module.css');

interface Props {
  input: any;
  label?: string;
  optionLabel: string;
  helperText?: string;
  val?: boolean;
}

const FieldCheckBox: React.FunctionComponent<Props> = ({
  input,
  label,
  optionLabel,
  helperText,
  val,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <div>
      <div className={styles.actionContainer}>
        <FormLabel component="label" className={classes.root}>
          {label && label}
        </FormLabel>
        <FormControlLabel
          style={{ marginBottom: 0 }}
          classes={{ label: classes.label }}
          control={
            <Checkbox
              {...input}
              {...rest}
              checked={val ? val : !!input.value}
              color="secondary"
              value="public"
            />
          }
          label={optionLabel}
        />
      </div>
      {helperText ? (
        <FormHelperText className={classes.helperText}>
          {helperText}
        </FormHelperText>
      ) : null}
    </div>
  );
};

export default FieldCheckBox;
