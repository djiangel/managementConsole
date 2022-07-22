import { validatePanelForm } from '../validatePanelForm';
import moment from 'moment';

describe('validatePanelForm', () => {
  it('should return an error if there are less than 1 products', () => {
    const errors = validatePanelForm({
      products: [],
      startTime: moment(),
      endTime: moment()
    });

    expect(['products']).toContain('products');
  });

  it('should return an error if startDate is after endDate', () => {
    const errors = validatePanelForm({
      products: [],
      startTime: moment().add('1', 'day'),
      endTime: moment()
    });

    expect(Object.keys(errors)).toContain('startTime');
  });
});
