import { format, parse } from 'libphonenumber-js';

const phoneNumberDefaultCountry = 'US';
const phoneNumberFormat = 'International_plaintext';

export default function normalizePhoneNumber(phoneNumberString: string) {
  const parsedPhoneNumber = parse(phoneNumberString, phoneNumberDefaultCountry);

  return format(parsedPhoneNumber, phoneNumberFormat) || phoneNumberString;
}
