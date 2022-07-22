import { debounce } from 'lodash';
import { event } from 'react-ga';

export const getDebouncedEventFn = (wait: number = 0, options?: object) =>
  debounce(event, wait, options);
