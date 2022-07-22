import React from 'react';
import {
  getMainImageUrl,
  getCountryText,
  formattedStringSelection,
  formattedDefaultAttributes
} from '../helper';

const STUB_IMAGE_DATA = [
  {
    url: 'http://www.imageurl.com',
    id: 1
  }
];
const STUB_IMAGE_URL = 'http://www.imageurl.com';

const STUB_COUNTRY_CODE = 'AE';
const STUB_COUNTRY_DISPLAY = '🇦🇪 undefined'; //country name is undefined due to react-i18n
const STUB_STRING_WITH_OTHERS = 'Others:Coffee';
const STUB_FORMATTED_STRING_WITH_OTHERS = {
  label: 'Others',
  value: 'Others',
  input: 'Coffee'
};
const STUB_STRING = 'Coffee';
const STUB_FORMATTED_STRING = {
  label: 'Coffee',
  value: 'Coffee'
};
const STUB_OBJECT = {
  Beer: {
    Style: 'Abby Double',
    Nitrogen: 'Yes',
    'Visual Clarity': 'Too Clear',
    'Serving Temperature': { unit: '°C', value: '28' }
  }
};
const STUB_FORMATTED_OBJECT = {
  Beer: {
    Style: {
      label: 'Abby Double',
      value: 'Abby Double'
    },
    Nitrogen: 'Yes',
    'Visual Clarity': {
      label: 'Too Clear',
      value: 'Too Clear'
    },
    'Serving Temperature': {
      unit: {
        label: '°C',
        value: '°C'
      },
      value: '28'
    }
  }
};
describe('Helper Functions', function() {
  describe('getMainImageUrl function', function() {
    it('should return image url if there is one', function() {
      const expected = STUB_IMAGE_URL;
      const actual = getMainImageUrl(STUB_IMAGE_DATA);
      expect(actual).toBe(expected);
    });
  });
  describe('getCountryText function', function() {
    it('should return country name', function() {
      const expected = STUB_COUNTRY_DISPLAY;
      const actual = getCountryText(STUB_COUNTRY_CODE);
      expect(actual).toBe(expected);
    });
  });
  xdescribe('formattedStringSelection function', function() {
    it('should return correct format if string contains `Others`', function() {
      const expected = STUB_FORMATTED_STRING_WITH_OTHERS;
      const actual = formattedStringSelection(STUB_STRING_WITH_OTHERS);
      expect(actual).toEqual(expected);
    });
    it('should return correct format it is string', function() {
      const expected = STUB_FORMATTED_STRING;
      const actual = formattedStringSelection(STUB_STRING);
      expect(actual).toEqual(expected);
    });
  });
  xdescribe('formattedDefaultAttributes', function() {
    it('should return correct format of object', function() {});
    const expected = STUB_FORMATTED_OBJECT;
    const actual = formattedDefaultAttributes(STUB_OBJECT);
    expect(actual).toEqual(expected);
  });
});
