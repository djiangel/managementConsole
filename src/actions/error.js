import { createAction } from 'redux-actions';

export const ERROR = 'ERROR';

export default createAction(
  ERROR,
  config => config.error,
  config =>
    config.title && {
      title: config.title,
      description: config.description,
      suppress: config.suppress
    }
);
