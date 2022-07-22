import React from 'react';
import { shallow, mount } from 'enzyme';
import RenderProductCountry from '../ProductCard/RenderProductCountry';
import styles from '../product.module.css';

const STUB_COUNTRY_CODE = 'AE';
const STUB_COUNTRY_DISPLAY = '🇦🇪 undefined';

describe('RenderProductCountry', function() {
  it('should render', function() {
    mount(<RenderProductCountry />);
  });
  describe('render', function() {
    it('should render without country code as `Not Selected`', function() {
      const render = shallow(
        <RenderProductCountry label="Country of Origin" />
      );
      const expectedRender = (
        <div className={styles.productPropertyContainer}>
          general.notSelected
        </div>
      );
      expect(render.contains(expectedRender)).toEqual(true);
    });
    it('should render with country name based on country code', function() {
      const render = shallow(
        <RenderProductCountry
          countryCode={STUB_COUNTRY_CODE}
          label="Country of Origin"
        />
      );
      const expectedRender = (
        <div className={styles.productPropertyContainer}>
          {STUB_COUNTRY_DISPLAY}
        </div>
      );

      expect(render.contains(expectedRender)).toEqual(true);
    });
  });
});
