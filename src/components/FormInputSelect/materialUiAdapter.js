import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import React from 'react';
import { COLORS } from '../../styles/theme';

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

export function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

export function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        classes: {
          underline: props.selectProps.classes.underline
        },
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

export function Option(props) {
  return props.selectProps.checkbox ? (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      {...props.innerProps}
    >
      <Checkbox checked={props.isSelected} color="secondary" />
      <ListItemText
        primary={props.children}
        primaryTypographyProps={{
          style: {
            fontWeight: props.isSelected ? 800 : 400,
            fontSize: 12
          }
        }}
      />
    </MenuItem>
  ) : (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 800 : 400,
        fontSize: 12
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

export function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

export function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

export function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

export function MultiValue(props) {
  return (
    <Chip
      onClick={() =>
        props.selectProps.isTriState &&
        props.setValue([
          ...props.selectProps.value.map(
            v => (v !== props.data ? v : { ...props.data, out: !v.out })
          )
        ])
      }
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
        [props.selectProps.classes.chipOut]: !!props.data.out
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={
        <CancelIcon
          style={{ color: COLORS.MARINE }}
          fontSize="small"
          {...props.removeProps}
        />
      }
    />
  );
}

export function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}
