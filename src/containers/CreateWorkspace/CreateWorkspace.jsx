import React, { Component } from 'react';
import styles from './CreateWorkspace.module.css';
import FieldTextInput from '../../components/FieldTextInput';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { withTranslation } from 'react-i18next';
import * as momentTZ from 'moment-timezone';
import FormInputSelect from '../../components/FormInputSelect';
import FormInput from '../../components/FormInput';

export class CreateWorkspace extends Component {
  render() {
    const { handleSubmit, submitting, pristine, invalid, t } = this.props;

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

    const getData = () => {
      return timeZoneList.map(tz => {
        return {
          value: tz.name,
          label: tz.reformatName
        };
      });
    };

    return (
      <div>
        <div className={styles.sectionContainer}>
          <Field
            name="name"
            component={FieldTextInput}
            fullWidth
            label={t('workspace.name')}
            required
          />
          <Field
            name="slug"
            component={FieldTextInput}
            fullWidth
            label={t('workspace.slug')}
            required
          />
          <Field
            name="defaultTimezone"
            component={FormInput}
            inputComponent={FormInputSelect}
            key="defaultTimezone"
            className={styles.inputSelect}
            options={timeZoneList ? getData() : null}
            hideSelectedOptions={false}
            placeholder={t('workspace.defaultTimezone')}
            closeMenuOnSelect={true}
            required
            value={val => val.value}
          />
        </div>

        <div className={styles.buttonContainer}>
          <MaterialButton
            variant="outlined"
            disabled={pristine || invalid || submitting}
            onClick={handleSubmit}
            soft
            teal
          >
            Submit
          </MaterialButton>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CreateWorkspace);
