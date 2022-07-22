import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import NutritionalInfo from '../NutritionalInfo';

const NutritionalInfoForm = () =>
  reduxForm({ formName: 'NutritionalInfo' })(NutritionalInfo);

describe('NutritionalInfo', function() {
  it('should render', function() {
    shallow(<NutritionalInfoForm />);
  });
});
