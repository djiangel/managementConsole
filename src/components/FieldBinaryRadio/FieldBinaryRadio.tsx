import * as React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from "components/FieldBinaryRadio/useStyles";
import RenderSwitch from 'components/ProductClassAttributesInput/RenderSwitch';

const styles = require('./FieldBinaryRadio.module.css');

interface Props {
  input: any;
  label?: string;
  optionLabel: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const FieldBinaryRadio: React.FunctionComponent<Props> = ({
  input,
  label,
  optionLabel,
  helperText,
  required,
  fullWidth,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div>
      <div className={styles.actionContainer}>
        <FormLabel component="label" className={classes.root} required={required}>
          {label && label}
        </FormLabel>
        <FormLabel component="label" className={classes.label}>{optionLabel}</FormLabel>
        <RenderSwitch
          input={input}
          {...rest}
          className={fullWidth ? styles.fullWidth : styles.field}
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

export default FieldBinaryRadio;
