import React, { Component, Fragment } from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
export default class RenderDatePicker extends Component {
  render() {
    const { input, placeholder, value, onChange, ...rest } = this.props;
    const valueToPass = input ? input.value || null : value || null;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Fragment>
          <KeyboardDatePicker
            value={valueToPass}
            onChange={input ? input.onChange : onChange}
            format="dd/MM/yyyy"
            placeholder={placeholder || 'dd/mm/yyyy'}
            disablePast
            minDateMessage=""
            {...rest}
          />
        </Fragment>
      </MuiPickersUtilsProvider>
    );
  }
}
