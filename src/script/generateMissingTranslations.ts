import en from '../i18n/translations/en';
import ja from '../i18n/translations/ja';
import zh from '../i18n/translations/zh';

import * as fs from 'fs';
import { get } from 'lodash';

let str = '';

const keyify = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    } else {
      return [...res, prefix + el];
    }
  }, []);

const translationsKeys = keyify(en);

const languages = [
  { name: 'Chinese', data: zh },
  { name: 'Japanese', data: ja }
];

str = '\ufeff"Translation Key","English","Target Language","Translation"\n';

languages.map(lang => {
  translationsKeys.map(tk => {
    if (get(lang.data, tk, 'Missing') === 'Missing') {
      str += `"${tk}","${get(en, tk)}","${lang.name}",""\n`;
    }
  });
  fs.writeFileSync(`./missing-translations-${lang.name}.csv`, str);
  str = '\ufeff"Translation Key","English","Target Language","Translation"\n';
});
