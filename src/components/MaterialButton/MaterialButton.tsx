import * as React from 'react';
import Button from '@material-ui/core/Button';
import { ButtonProps } from '@material-ui/core/Button';
import useStyles from 'components/MaterialButton/useStyles';

interface Props extends ButtonProps {
  children: string | any;
  soft?: boolean;
  teal?: boolean;
}

const MaterialButton: React.FunctionComponent<Props> = ({
  children,
  variant,
  color,
  onClick,
  disabled,
  soft,
  teal,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Button
      classes={{ 
        root: soft ? (teal ? classes.softTeal : classes.softRoot) : classes.root, 
        label: classes.label,
        sizeSmall: classes.small,
        outlinedSecondary: classes.outlinedSecondary
      }}
      color={color}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default MaterialButton;
