/* global it expect */
import error from '../error';

const testError = new Error('Test Error');
const testErrorActionConfiguration = {
  description: 'A test error',
  error: testError,
  title: 'Test Error!',
  suppress: false
};
const testErrorAction = error(testErrorActionConfiguration);

it("has the value of its configuration's `error` property as its `payload`", () => {
  expect(testErrorAction.payload).toBe(testErrorActionConfiguration.error);
});

it('has the value `title`, `description` and `suppress` in its `meta` object', () => {
  expect(testErrorAction.meta.description).toBe(
    testErrorActionConfiguration.description
  );
  expect(testErrorAction.meta.title).toBe(testErrorActionConfiguration.title);
  expect(testErrorAction.meta.suppress).toBe(
    testErrorActionConfiguration.suppress
  );
});

it('has `error` `true` when configured with an Error payload', () => {
  expect(testErrorAction.error).toBe(true);
});
