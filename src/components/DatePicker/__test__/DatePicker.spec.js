import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  // it('should properly set the date', () => {
  //   let value = moment();
  //   const setValue = v => {
  //     value = v;
  //   };

  //   const wrapper = shallow(<DatePicker setValue={setValue} value={value} />);

  //   wrapper.find({ name: 'date-selection' }).simulate('change', {
  //     target: {
  //       value: '2019-01-01'
  //     }
  //   });

  //   expect(value.format('YYYY-MM-DD')).toBe('2019-01-01');
  // });

  it('should properly set the hour', () => {
    let value = moment('2019-01-01', 'YYYY-MM-DD');
    const setValue = v => {
      value = v;
    };

    const wrapper = shallow(<DatePicker setValue={setValue} value={value} />);

    wrapper.find({ name: 'hour-selection' }).simulate('change', {
      target: {
        value: 14
      }
    });

    expect(value.format('HH')).toBe('14');
  });

  it('should properly set the minute', () => {
    let value = moment('2019-01-01', 'YYYY-MM-DD');
    const setValue = v => {
      value = v;
    };

    const wrapper = shallow(<DatePicker setValue={setValue} value={value} />);

    wrapper.find({ name: 'minute-selection' }).simulate('change', {
      target: {
        value: 30
      }
    });

    expect(value.format('mm')).toBe('30');
  });
});
