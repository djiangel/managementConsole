import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import ProductClassAttributes from '../ProductClassAttributes';

const ProductClassAttributeForm = () =>
  reduxForm({ formName: 'ProductClassAttributes' })(() => (
    <ProductClassAttributes productClass="General" />
  ));

describe('ProductClassAttributes', function() {
  it('should render', function() {
    shallow(<ProductClassAttributeForm />);
  });
});
