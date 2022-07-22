import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import ProductAttributes from '../ProductAttributes';

const ProductAttributeForm = () =>
  reduxForm({ formName: 'ProductAttribute' })(() => <ProductAttributes />);

describe('ProductAttribute', function() {
  it('should render', function() {
    shallow(<ProductAttributeForm />);
  });
});
