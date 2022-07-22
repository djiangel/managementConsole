export const INPUT_TYPE = {
  DATE_PICKER: 0,
  TIME_PICKER: 1,
  TEXT_INPUT: 2,
  TEXT_INPUT_SUFFIX: 3,
  DROPDOWN: 4,
  DROPDOWN_CREATABLE: 5,
  SWITCH: 6,
  NUMBER_INPUT: 7,
  NUMBER_INPUT_SUFFIX: 8,
  TEXT_AREA_INPUT: 9,
  RADIO_BUTTON_CREATABLE: 10,
  RADIO_BUTTON: 11,
  DROPDOWN_MULTI_CREATABLE: 12,
  DROPDOWN_MULTI: 13
};

export const PRODUCT_CLASS_ATTRIBUTES = {
  Malt: [
    {
      label: 'Grain Varietal',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Production Step',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'productionStep'
    },
    {
      label: 'Roast Temperature',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Kiln Time',
      type: INPUT_TYPE.TIME_PICKER
    },
    {
      label: 'Kiln Temperature',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Moisture Content',
      type: INPUT_TYPE.NUMBER_INPUT
    }
  ],
  Soda: [
    {
      label: 'Syrup',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Packaging',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Container',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Serving Temperature',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['°F', '°C', 'K']
    },
    {
      label: 'Style',
      type: INPUT_TYPE.TEXT_INPUT
    }
  ],
  Tea: [
    {
      label: 'Class',
      type: INPUT_TYPE.DROPDOWN,
      key: 'class'
    },
    {
      label: 'Region',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Source',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Season of Harvest',
      type: INPUT_TYPE.DROPDOWN,
      key: 'seasonOfHarvest'
    },
    {
      label: 'Year of Harvest',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Roast Level',
      type: INPUT_TYPE.DROPDOWN,
      key: 'roastLevel'
    },
    {
      label: 'Roast Type',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'roastType'
    },
    {
      label: 'Cultivar',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'CTC',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Brew Method',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'brewMethod'
    },
    {
      label: 'Material of Brewing Vessel',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Brew Number',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Weight of Tea',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['oz', 'g']
    },
    {
      label: 'Volume of Water',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['mL', 'fl. oz']
    },
    {
      label: 'Cup Material',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'cupMaterial'
    },
    {
      label: 'Brewer',
      type: INPUT_TYPE.TEXT_INPUT
    }
  ],
  Spirits: [
    {
      label: 'Type of Spirit',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'typeOfSpirit'
    },
    {
      label: 'Age',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Edition',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'ABV',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Bottle Number',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Barrel Number',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Rick Number',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Warehouse',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Maturation',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Preparation',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'preparation'
    }
  ],
  Beer: [
    {
      label: 'CCP',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'ccp'
    },
    {
      label: 'Packaging',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'ABV',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Style',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'style'
    },
    {
      label: 'Visual Clarity',
      type: INPUT_TYPE.DROPDOWN,
      key: 'visualClarity'
    },
    {
      label: 'Serving Temperature',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['°F', '°C', 'K']
    },
    {
      label: 'Nitrogen',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'None',
      type: INPUT_TYPE.NULL_INPUT
    }
  ],
  Chocolate: [
    {
      label: 'Cacao',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Lecithin',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Additions',
      type: INPUT_TYPE.TEXT_INPUT
    }
  ],
  Cigar: [
    {
      label: 'Shape',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Wrapper',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Filler',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Vintage',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Shade Level',
      type: INPUT_TYPE.DROPDOWN,
      key: 'shadeLevel'
    },
    {
      label: 'Ring Gauge',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Length',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['cm', 'inches']
    }
  ],
  Coffee: [
    {
      label: 'CCP',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'ccp'
    },
    {
      label: 'Day of Roast',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Preparation',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'preparation'
    },
    {
      label: 'Filter',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Harvest Date',
      type: INPUT_TYPE.DATE_PICKER
    },
    {
      label: 'Brew Duration',
      type: INPUT_TYPE.TIME_PICKER
    },
    {
      label: 'Bloom Duration',
      type: INPUT_TYPE.TIME_PICKER
    },
    {
      label: 'Grind',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Weight',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['grams', 'ounces']
    },
    {
      label: 'Volume of Water',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['mL', 'fl. ounces']
    },
    {
      label: 'Water Type',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'waterType'
    },
    {
      label: 'Water Temperature',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['°F', '°C', 'K']
    },
    {
      label: 'Brew Temperature',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['°F', '°C', 'K']
    },
    {
      label: 'Total Dissolved Solids',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Elevation',
      type: INPUT_TYPE.NUMBER_INPUT_SUFFIX,
      values: ['meters', 'feet']
    },
    {
      label: 'Green Processing',
      type: INPUT_TYPE.DROPDOWN_CREATABLE,
      key: 'greenProcessing'
    },
    {
      label: 'Farm',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Barista',
      type: INPUT_TYPE.TEXT_INPUT
    }
  ],
  Wine: [
    {
      label: 'Vintage',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Style',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'ABV',
      type: INPUT_TYPE.NUMBER_INPUT
    },
    {
      label: 'Sparkling',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Harvest Date',
      type: INPUT_TYPE.DATE_PICKER
    },
    {
      label: 'Region',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Grape Varietal',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Decanted',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Aerated',
      type: INPUT_TYPE.SWITCH
    }
  ],
  General: [
    // {
    //   label: 'Date of Production',
    //   type: INPUT_TYPE.DATE_PICKER
    // },
    // {
    //   label: 'Date of Expiration',
    //   type: INPUT_TYPE.DATE_PICKER
    // },
    // {
    //   label: 'Batch Number',
    //   type: INPUT_TYPE.TEXT_INPUT
    // },
    {
      label: 'Establishments',
      type: INPUT_TYPE.TEXT_INPUT
    },
    {
      label: 'Notes',
      type: INPUT_TYPE.TEXT_AREA_INPUT
    }
  ],
  Batch: [
    {
      label: 'Batch Number',
      type: INPUT_TYPE.TEXT_INPUT
    }
  ],
  // Date: [
  //   {
  //     label: 'Date of Production',
  //     type: INPUT_TYPE.DATE_PICKER,
  //     maxDate: new Date()
  //   },
  //   {
  //     label: 'Date of Expiration',
  //     type: INPUT_TYPE.DATE_PICKER
  //   }
  // ],
  Liquid: [
    {
      label: 'Carbonated',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Nitrogen',
      type: INPUT_TYPE.SWITCH
    }
  ],

  'Non-Dairy Milk': [
    {
      label: 'Category',
      type: INPUT_TYPE.RADIO_BUTTON_CREATABLE,
      key: 'category'
    },
    {
      label: 'Limited Edition',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Category (Others)',
      type: INPUT_TYPE.TEXT_INPUT,
      placeholder: 'Category (Others)'
    },
    {
      label: 'Limited Edition Notes',
      type: INPUT_TYPE.TEXT_INPUT,
      placeholder: 'Limited Edition Notes'
    },
    {
      label: 'Flavor',
      type: INPUT_TYPE.DROPDOWN_MULTI_CREATABLE,
      key: 'flavor'
    },
    {
      label: 'Carrageenan',
      type: INPUT_TYPE.SWITCH
    },
    {
      label: 'Style',
      type: INPUT_TYPE.DROPDOWN_MULTI_CREATABLE,
      key: 'style'
    },
    {
      label: 'Sweetened',
      type: INPUT_TYPE.SWITCH
    }
  ]
};
