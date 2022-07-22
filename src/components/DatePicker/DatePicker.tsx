import * as React from 'react';
import * as momentTZ from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import RenderDatePicker from '../../components/ProductClassAttributesInput/RenderDatePicker';
import moment from 'moment';

const styles = require('./DatePicker.module.css');

interface DatePickerProps {
  label: string;
  value: any;
  setValue: (d) => void;
  onTimezoneChange?: (tz) => void;
}

const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const timeZoneList = momentTZ.tz
  .names()
  .map(timezone => {
    let parsedName = timezone
      .split('_')
      .join(' ')
      .split('/');

    const parseArray = parsedName => {
      switch (parsedName.length) {
        case 1:
          return parsedName[0];
        case 2:
          return parsedName[1];
        case 3:
          return parsedName[2] + ', ' + parsedName[1];
        default:
          return parsedName;
      }
    };

    // API has the sign backwards for timezones of the form GMT+/-4
    const fixGMT = parsedName => {
      if (
        parsedName.length > 3 &&
        parsedName.substring(0, 3) == 'GMT' &&
        '+-'.includes(parsedName.charAt(3))
      ) {
        return 'GMT' + switchOffsetSigns(parsedName.substring(3));
      }
      return parsedName;
    };

    const switchOffsetSigns = offset => {
      switch (offset.charAt(0)) {
        case '-':
          return '+' + offset.substring(1);
        case '+':
          return '-' + offset.substring(1);
      }
    };
    const offset = momentTZ.tz(timezone).format('Z');
    const abbrev = momentTZ.tz(timezone).format('z');

    let abbr =
      abbrev.charAt(0) === '-' || abbrev.charAt(0) === '+'
        ? ''
        : abbrev + ' - ';

    return {
      name: timezone,
      offset,
      reformatName:
        '(GMT' + offset + ') ' + abbr + fixGMT(parseArray(parsedName))
    };
  })
  .sort((a, b) => {
    if (a.offset === b.offset) {
      return a.reformatName.localeCompare(b.reformatName);
    }
    return parseInt(a.offset) - parseInt(b.offset);
  })
  .filter((element, index, array) => {
    const nextInd = array
      .slice(index + 1)
      .findIndex(e => e.reformatName === element.reformatName);
    return nextInd == -1;
  });

/**
 * Generic datetime picker
 *
 * Only supports moment objects
 */
export function DatePicker(props: DatePickerProps) {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <label>{props.label}</label>
      <RenderDatePicker
      name="date-selection"
      input={
        {
          value: props.value ? props.value.toDate() : '',
          onChange: value => {
            props.setValue(
              momentTZ
                .tz(value, 'YYYY-MM-DD', props.value.tz())
                .hours(props.value.hours())
                .minutes(props.value.minutes())
            );
          }
        }}
      fullWidth
      />
      {/* <input
        name="date-selection"
        type="date"
        onChange={e => {
          props.setValue(
            momentTZ
              .tz(e.target.value, 'YYYY-MM-DD', props.value.tz())
              .hours(props.value.hours())
              .minutes(props.value.minutes())
          );
        }}
        className={styles.datePicker}
        value={props.value && props.value.format('YYYY-MM-DD')}
      /> */}
      <div className={styles.timePicker}>
        <div className={styles.timeContainer}>
          <label>{t('datepicker.hour')}</label>
          <select
            name="hour-selection"
            onChange={e => {
              props.setValue(props.value.hours((parseInt(e.target.value) + (props.value.hour() >= 12 ? 12 : 0)) % 24));
            }}
            value={((props.value.hour() + 11) % 12) + 1}
          >
            {range(0, 11, 1).map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.timeContainer}>
          <label>{t('datepicker.minute')}</label>
          <select
            name="minute-selection"
            onChange={e => {
              props.setValue(props.value.minutes(parseInt(e.target.value)));
            }}
            value={props.value.minutes()}
          >
            <option>0</option>
            <option>15</option>
            <option>30</option>
            <option>45</option>
          </select>
        </div>
        <div className={styles.timeContainer}>
          <label>{t('datepicker.daySelection')}</label>
          <select
            name="am-pm-selection"
            onChange={() => {
              props.setValue(props.value.hours((props.value.hour() + 12) % 24));
            }}
            value={props.value.hour() < 12 ? 'AM' : 'PM'}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
        <div className={styles.timeContainer}>
          <label>{t('datepicker.timezone')}</label>
          <select
            name={'time-zone-selection'}
            onChange={e => {
              props.setValue(
                momentTZ.tz(
                  props.value.format('YYY-MM-DD HH:mm'),
                  'YYY-MM-DD HH:mm',
                  e.target.value
                )
              );
              props.onTimezoneChange && props.onTimezoneChange(e.target.value);
            }}
            value={props.value.tz()}
          >
            {timeZoneList.map(tz => {
              return (
                <option key={tz.name} value={tz.name}>
                  {tz.reformatName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
