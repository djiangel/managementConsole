import React from 'react';
import { shallow, mount } from 'enzyme';
import RenderAttributes from '../ProductCard/RenderAttributes';

const STUB_DEFAULT_ATTRIBUTES = {
  General: {
    Notes: 'Organic'
  },
  Tea: {
    Class: 'Green'
  }
};

const STUB_PRODUCT_ATTRIBUTES = {
  text: [{ key: 'Vanilla', unit: 'mg', value: '3' }],
  binary: [{ key: 'Roasted', value: 'Yes' }]
};

describe('RenderAttributes', function() {
  it('should render', function() {
    mount(<RenderAttributes />);
  });

  describe('render', function() {
    it('should render 2 product class attributes', function() {
      const wrapper = shallow(
        <RenderAttributes defaultAttributes={STUB_DEFAULT_ATTRIBUTES} />
      );
      expect(wrapper.find('div.productPropertyTableContainer').length).toBe(2);
    });

    it('should render product attributes only', function() {
      const wrapper = shallow(
        <RenderAttributes productAttributes={STUB_PRODUCT_ATTRIBUTES} />
      );

      expect(wrapper.find('div.productPropertyTableContainer').length).toBe(1);
    });
  });
});
