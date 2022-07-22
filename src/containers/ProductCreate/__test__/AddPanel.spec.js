import React from 'react';
import { reduxForm } from 'redux-form';
import { shallow } from 'enzyme';
import AddPanel from '../AddPanel';

const STUB_DATA = {
  producer: {
    panels: {
      nodes: [
        { id: 1, pin: '1234' },
        { id: 2, pin: '2345' },
        { id: 3, pin: '3456' }
      ]
    }
  }
};

const AddPanelForm = () =>
  reduxForm({ formName: 'AddPanel' })(() => <AddPanel data={STUB_DATA} />);

describe('AddPanel', function() {
  it('should render', function() {
    shallow(<AddPanelForm />);
  });
});
