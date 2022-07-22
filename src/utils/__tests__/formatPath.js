/* global it expect */
import formatPath from '../formatPath';

const ACCOUNT_PATH = '/@:accountId';
const ACCOUNT_USERS_PATH = '/@:accountId/users';
const ACCOUNT_USER_PATH = '/@:accountId/users/:username';

it('returns a formatted path with the passed params', () => {
  const testAccountId = 'myAccount';
  const testUsername = 'bestUser';

  const expectedFormattedAccountPath = `/@${testAccountId}`;
  const expectedFormattedAccountUsersPath = `/@${testAccountId}/users`;
  const expectedFormattedAccountUserPath = `/@${testAccountId}/users/${testUsername}`;

  expect(formatPath(ACCOUNT_PATH, { accountId: testAccountId })).toBe(
    expectedFormattedAccountPath
  );
  expect(formatPath(ACCOUNT_USERS_PATH, { accountId: testAccountId })).toBe(
    expectedFormattedAccountUsersPath
  );
  expect(
    formatPath(ACCOUNT_USER_PATH, {
      accountId: testAccountId,
      username: testUsername
    })
  ).toBe(expectedFormattedAccountUserPath);
});
