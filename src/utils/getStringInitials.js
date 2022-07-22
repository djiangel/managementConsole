import { head, words } from 'lodash';

export default function getStringInitials(string: String) {
  return words(string)
    .map(head)
    .join('');
}
