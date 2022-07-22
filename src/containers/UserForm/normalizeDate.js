import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';

const dateFormat = 'MM/DD/YYYY';
const parseDateLength = dateFormat.length;

export default function normalizeDate(dateString: string) {
  const parsedDate =
    dateString.length === parseDateLength && parseDate(dateString);

  return parsedDate ? formatDate(parseISO(parsedDate), dateFormat) : dateString;
}
