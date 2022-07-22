export const PRODUCT_CLASSES = [
  'Beer',
  'Cheese',
  'Chocolate',
  'Cider',
  'Cigar',
  'Coffee',
  'Confectionary',
  'Energy Drink',
  'Flavors',
  'Hop',
  'Malt',
  'Milk',
  'Noodles',
  'Sake',
  'Soda',
  'Spirit',
  'Tea',
  'Water',
  'Wine',
  'Other'
];

export const PRODUCT_ATTRIBUTES = [
  'alcohol_by_volume',
  'ibu',
  'brand',
  'brewery',
  'application',
  'flavor',
  'brand',
  'base',
  'dosage',
  'IPC/Experimental'
];

export const ALLERGEN_ATTRIBUTES = {
  CONTAINS: [
    'No Allergens',
    'Dairy',
    'Eggs',
    'Fish',
    'Nuts',
    'Peanuts',
    'Soybeans',
    'Shellfish',
    'Wheat',
    'Seeds'
  ],
  SAFE: ['Gluten-Free', 'Nut-Free', 'Kosher', 'Halal', 'Vegan', 'Vegetarian']
};

export const ALL_ALLERGENS = ALLERGEN_ATTRIBUTES.CONTAINS.slice(
  1,
  ALLERGEN_ATTRIBUTES.CONTAINS.length
);

export const SERVING_VESSEL = [
  'Can',
  'Ceramic Cup',
  'Plastic Cup',
  'Plate',
  'Bowl',
  'Pouch',
  'Glass',
  'Wine Glass',
  'Tulip Glass',
  'Flute Glass',
  'Thermos',
  'Others'
];

export const PHYSICAL_STATE = [
  'Solid',
  'Semi-Solid',
  'Liquid',
  'Carbonated Liquid',
  'Gas',
  'Frozen',
  'Others'
];
