import React from 'react';
import { mount } from 'enzyme';
import PanelProductTable from '../PanelProductTable';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

describe('PanelProductTable', () => {
  it('should show the blind label input if the blind panel prop is true and is editable', () => {
    const history = createMemoryHistory();
    const wrapper = mount(
      <Router history={history}>
        <PanelProductTable
          data={[
            {
              id: 1,
              name: 'Test',
              defaultAttributes: {
                brand: 'Test'
              },
              public: true,
              productClass: 'test',
              producer: {
                name: 'Test'
              }
            }
          ]}
          blindPanel={true}
          afsWorkspaceBool={false}
          onClickRow={() => {}}
          setBlindLabel={() => {}}
          setServingVessel={() => {}}
          setClientName={() => {}}
          setProjectName={() => {}}
          setTotalCost={() => {}}
          setBehavioralQuestions={() => {}}
          setExpirationDate={() => {}}
          setProductionDate={() => {}}
          blindLabels={{}}
          clientNames={{}}
          servingVessels={{}}
          projectNames={{}}
          totalCosts={{}}
          editable={true}
          behavioralQuestions={{}}
          oldBehavioralQuestions={{}}
          workspaceName={{}}
        />
      </Router>
    );
    expect(wrapper.find('input').length).toBe(3);
  });
});
