import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import ProductTag from '../ProductTag';

const STUB_DATA = {
  tags: {
    nodes: [
      { id: 1, tag: 'Dessert' },
      { id: 2, tag: 'Soda' },
      { id: 3, tag: 'Candy' }
    ]
  }
};

const ProductTagForm = () =>
  reduxForm({ formName: 'ProductTag' })(() => <ProductTag data={STUB_DATA} />);

describe('ProductTag', function() {
  it('should render', function() {
    shallow(<ProductTagForm />);
  });
});
