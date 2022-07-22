export type GastrographEntry = {
  astringent: number,
  bitter: number,
  coldFinish: number,
  dairy: number,
  dry: number,
  earthy: number,
  floral: number,
  fruits: number,
  gamey: number,
  herbaceous: number,
  marine: number,
  meaty: number,
  mineral: number,
  mouthfeel: number,
  nutsAndSeeds: number,
  retronasal: number,
  rich: number,
  roasted: number,
  smoked: number,
  sourAndAcidity: number,
  spices: number,
  sugar: number,
  wet: number,
  woody: number
};

export default function chartDataByGastrographEntry(
  gastrographEntry: GastrographEntry
): { label: string, value: number }[] {
  return [
    { label: 'Wet', value: gastrographEntry.wet },
    { label: 'Roasted', value: gastrographEntry.roasted },
    { label: 'Earthy', value: gastrographEntry.earthy },
    { label: 'Astringent', value: gastrographEntry.astringent },
    { label: 'Marine', value: gastrographEntry.marine },
    { label: 'Mineral', value: gastrographEntry.mineral },
    { label: 'Retronasal', value: gastrographEntry.retronasal },
    { label: 'Gamey', value: gastrographEntry.gamey },
    { label: 'Woody', value: gastrographEntry.woody },
    { label: 'Bitter', value: gastrographEntry.bitter },
    { label: 'Meaty', value: gastrographEntry.meaty },
    { label: 'Smoked', value: gastrographEntry.smoked },
    { label: 'Dry', value: gastrographEntry.dry },
    { label: 'Rich', value: gastrographEntry.rich },
    { label: 'Dairy', value: gastrographEntry.dairy },
    { label: 'Mouth Feel', value: gastrographEntry.mouthfeel },
    { label: 'Nuts & Seeds', value: gastrographEntry.nutsAndSeeds },
    { label: 'Herbaceous', value: gastrographEntry.herbaceous },
    { label: 'Cold Finish', value: gastrographEntry.coldFinish },
    { label: 'Floral', value: gastrographEntry.floral },
    { label: 'Spices', value: gastrographEntry.spices },
    { label: 'Sour & Acidity', value: gastrographEntry.sourAndAcidity },
    { label: 'Fruits', value: gastrographEntry.fruits },
    { label: 'Sugar', value: gastrographEntry.sugar }
  ];
}
