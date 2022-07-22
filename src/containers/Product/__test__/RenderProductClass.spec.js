import React from 'react';
import { mount } from 'enzyme';
import RenderProductClass from '../ProductCard/RenderProductClass';

const STUB_CLASS = [
  {
    productClassByProductClassId: {
      name: 'Beer',
      id: 1
    }
  }
];

describe('RenderProductClass', function() {
  it('should render', function() {
    mount(<RenderProductClass productClasses={STUB_CLASS} />);
  });

  describe('render', function() {
    it('should render with product class', function() {
      const wrapper = mount(<RenderProductClass productClasses={STUB_CLASS} />);

      expect(wrapper.find('div.ReactTags__selected').length).toBe(1);
    });
  });
});
