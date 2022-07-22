export const USDA_SEARCH_URI = 'https://api.nal.usda.gov/fdc/v1/search?';
export const USDA_NUTRIENTS_URI = 'https://api.nal.usda.gov/fdc/v1/';

export const LABEL_NUTRIENTS = 'labelNutrients';
export const LABEL_NUTRIENTS_USDA_MAPPING = [
  { field: 'Calories', usda: 'calories', unit: '' },
  { field: 'Sodium', usda: 'sodium', unit: 'mg' },
  { field: 'Total fat', usda: 'fat', unit: 'g' },
  { field: 'Total Carbohydrates', usda: 'carbohydrates', unit: 'g' },
  { field: 'Cholesterol', usda: 'cholesterol', unit: 'mg' }
];

export const SERVING_SIZE = 'servingSize';
export const SERVING_SIZE_UNIT = 'servingSizeUnit';
export const INGREDIENTS = 'ingredients';
export const NAME = 'description';
export const BRAND = 'brandOwner';
