import React from 'react';
import { shallow, mount } from 'enzyme';
import RenderNutritionalInfo from '../ProductCard/RenderNutritionalInfo';

const STUB_NUTRITIONAL_INFO = {
  Calories: '300 g',
  Sodium: '40 g'
};

describe('RenderNutritionalInfo', function() {
  it('should render', function() {
    mount(<RenderNutritionalInfo />);
  });

  describe('render', function() {
    it('should render without nutritional info as `No Data`', function() {
      const render = shallow(<RenderNutritionalInfo />);
      const expectedRender = (
        <div className="productPropertyTableContainer">general.noData</div>
      );

      expect(render.contains(expectedRender)).toEqual(true);
    });

    xit('should render nutritional info data', function() {
      const render = shallow(
        <RenderNutritionalInfo nutritionalInfo={STUB_NUTRITIONAL_INFO} />
      );
      const expectedRender = (
        <div>
          <div>Calories: 300 g</div>
          <div>Sodium: 40 g</div>
        </div>
      );

      expect(render.contains(expectedRender)).toEqual(true);
    });
  });
});
