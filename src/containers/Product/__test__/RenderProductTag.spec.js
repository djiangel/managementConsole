import React from 'react';
import { shallow, mount } from 'enzyme';
import RenderProductTag from '../ProductCard/RenderProductTag';

const STUB_TAGS = [
  {
    tagByTagId: { tag: 'Chocolate', id: 1 }
  }
];

const STUB_EMPTY_TAG = [];

describe('RenderProductTag', function() {
  it('should render', function() {
    mount(<RenderProductTag productTags={STUB_EMPTY_TAG} />);
  });

  describe('render', function() {
    it('should render without any tags', function() {
      const render = shallow(<RenderProductTag productTags={STUB_EMPTY_TAG} />);
      const expectedRender = <div className="tag">general.noTagSelected</div>;

      expect(render.contains(expectedRender)).toEqual(true);
    });

    it('should render with tags', function() {
      const wrapper = mount(<RenderProductTag productTags={STUB_TAGS} />);

      expect(wrapper.find('div.ReactTags__selected').length).toBe(1);
    });
  });
});
