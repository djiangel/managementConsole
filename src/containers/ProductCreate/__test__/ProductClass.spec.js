import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import ProductClass from '../ProductClass';

const STUB_DATA = {
  productClasses: {
    nodes: [
      { id: 1, name: 'Cheese' },
      { id: 2, name: 'Beer' },
      { id: 3, name: 'Tea' }
    ]
  }
};

const ProductClassForm = () =>
  reduxForm({ formName: 'ProductClass' })(() => (
    <ProductClass data={STUB_DATA} />
  ));

describe('ProductAttribute', function() {
  it('should render', function() {
    shallow(<ProductClassForm />);
  });
});
