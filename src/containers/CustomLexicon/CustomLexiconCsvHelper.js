const CsvFields = (referenceFlavors, languages) => {
  const localLanguages = [...languages];
  localLanguages.unshift('value');
  localLanguages.unshift('flavorAttribute');
  const list = referenceFlavors.map(l =>
    localLanguages.reduce((acc, cur) => {
      acc[cur] = l[cur];
      return acc;
    }, {})
  );
  return list;
};

export { CsvFields };
