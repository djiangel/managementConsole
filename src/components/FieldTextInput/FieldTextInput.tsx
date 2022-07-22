import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import useStyles from 'components/FieldTextInput/useStyles';

interface Props {
  id?: string;
  input?: object;
  label?: string;
  meta?: any;
  margin?: any;
  variant?: any;
  inputComponent?: any;
  value?: string;
  placeholder?: string;
  onChange?: any;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  InputProps?: object;
}

const FieldTextInput: React.FunctionComponent<Props> = ({
  input,
  meta,
  label,
  variant,
  inputComponent,
  margin,
  InputProps,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <>
      <TextField
        {...input}
        label={label}
        error={meta && meta.touched && meta.error}
        margin={margin ? margin : 'dense'}
        variant={variant}
        InputProps={{
          classes: {
            root: classes.root,
            underline: variant !== 'outlined' && classes.underline,
            input: classes.input,
            notchedOutline: variant === 'outlined' && classes.notchedOutline,
            focused: classes.focused
          },
          inputComponent: inputComponent && inputComponent,
          ...InputProps
        }}
        InputLabelProps={{
          classes: {
            root: classes.rootLabel
          }
        }}
        {...rest}
      />
      {meta && meta.touched && ((meta.error && <span>{meta.error}</span>) || (meta.warning && <span>{meta.warning}</span>))}
    </>
  );
};

export default FieldTextInput;
