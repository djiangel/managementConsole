import React, { Component } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import AsyncSelect from 'react-select/lib/Async';
import NoSsr from '@material-ui/core/NoSsr';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './withStyleComponent';
import {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
} from './materialUiAdapter';

export const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class FormInputSelect extends Component {
  static defaultProps = {
    optionTextExtractor: option => option,
    optionValueExtractor: option => option
  };

  getOptionSelectObject = option => {
    const { optionTextExtractor, optionValueExtractor } = this.props;

    if (typeof option === 'object') {
      return option;
    } else {
      return {
        label: optionTextExtractor(option),
        value: optionValueExtractor(option)
      };
    }
  };

  // Returns the `options` in an array of {label: value:} key-value pair
  options =
    this.props.options && this.props.options.map(this.getOptionSelectObject);

  render() {
    const {
      labelText,
      meta,
      creatable,
      async,
      loadOptions,
      required,
      onBlur,
      onChange,
      value,
      classes,
      theme,
      menuIsOpen,
      ...rest
    } = this.props;

    const selectStyles = {
      menuPortal: base => ({
        ...base,
        zIndex: 1
      }),
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit'
        }
      }),
      container: base => ({
        ...base,
        flex: 2
      })
    };

    return (
      <NoSsr>
        {creatable ? (
          <CreatableSelect
            menuPortalTarget={document.body}
            {...rest}
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: labelText,
              InputLabelProps: {
                shrink:
                  (meta && meta.active) ||
                  (!Array.isArray(value) && !!value) ||
                  (Array.isArray(value) && !!value.length)
              },
              error: meta && meta.touched && meta.error,
              required: required
            }}
            onBlur={() => onBlur(value)}
            onChange={onChange}
            options={this.options}
            value={value}
            components={components}
            menuIsOpen={menuIsOpen}
          />
        ) : async ? (
          <AsyncSelect
            {...rest}
            isClearable
            menuPortalTarget={document.body}
            components={components}
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: labelText,
              required: required
            }}
            onBlur={() => onBlur(value)}
            onChange={onChange}
            value={value}
            cacheOptions
            loadOptions={loadOptions}
          />
        ) : (
          <Select
            menuPortalTarget={document.body}
            {...rest}
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: labelText,
              InputLabelProps: {
                shrink:
                  meta.active ||
                  (!Array.isArray(value) && !!value) ||
                  (Array.isArray(value) && !!value.length)
              },
              error: meta.touched && meta.error,
              required: required
            }}
            onBlur={() => onBlur(value)}
            onChange={onChange}
            options={this.options}
            value={value}
            components={components}
            hideSelectedOptions={false}
          />
        )}
      </NoSsr>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FormInputSelect);
