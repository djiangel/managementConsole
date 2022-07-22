import React from 'react';
import { shallow, mount } from 'enzyme';
import RenderProductText from '../ProductCard/RenderProductText';
import styles from '../product.module.css';

const STUB_LABEL = 'Name';
const STUB_PROPERTY = 'Orange Juice';

describe('RenderProductText', function() {
  it('should render', function() {
    mount(<RenderProductText label="Name" />);
  });

  describe('render', function() {
    it('should render without property with `Not Selected`', function() {
      const render = shallow(<RenderProductText label={STUB_LABEL} />);
      const expectedRender = (
        <div className={styles.productPropertyContainer}>
          general.notSelected
        </div>
      );
      expect(render.contains(expectedRender)).toEqual(true);
    });

    it('should render with property', function() {
      const render = shallow(
        <RenderProductText label={STUB_LABEL} property={STUB_PROPERTY} />
      );
      const expectedRender = (
        <div className={styles.productPropertyContainer}>{STUB_PROPERTY}</div>
      );
      expect(render.contains(expectedRender)).toEqual(true);
    });
  });
});
