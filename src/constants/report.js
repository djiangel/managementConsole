// Report Types
export const MARKET_SURVEY = 'Market Survey';
export const PRODUCT = 'Product';
export const OPTIMIZATION = 'Optimization';

export function formatReportType(reportTypeFromDb) {
  switch (reportTypeFromDb) {
    case 'market_survey':
      return MARKET_SURVEY;
    case 'optimization':
      return OPTIMIZATION;
    case null:
      return '';
    default:
      return 'Unknown: ' + reportTypeFromDb;
  }
}

export const STATUS_ENUM = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

export const DECISION_ENUM = {
  ACCEPT: 'ACCEPT',
  REJECT: 'REJECT'
};

export const REPORT_TYPE_ENUM = {
  MARKET_SURVEY: 'MARKET_SURVEY',
  OPTIMIZATION: 'OPTIMIZATION',
  PRODUCT: 'PRODUCT'
};

export const COUNTRIES = [
  {
    code: 'usa',
    twoCode: 'US',
    unicode: 'U+1F1FA U+1F1F8',
    name: 'United States',
    emoji: '🇺🇸',
    raceAndEthnicity: [
      'Hispanic',
      'White',
      'Black or African American',
      'American Indian or Alaska Native',
      'Asian',
      'Native Hawaiian or Other Pacific Islander'
    ]
  },
  {
    code: 'canada',
    twoCode: 'CA',
    unicode: 'U+1F1E8 U+1F1E6',
    name: 'Canada',
    emoji: '🇨🇦'
  },
  {
    code: 'AFS CLT Toronto',
    twoCode: 'CA',
    unicode: 'U+1F1E8 U+1F1E6',
    name: 'Canada (Toronto)',
    emoji: '🇨🇦'
  },
  {
    code: 'mexico',
    twoCode: 'MX',
    unicode: 'U+1F1F2 U+1F1FD',
    name: 'Mexico',
    emoji: '🇲🇽'
  },
  {
    code: 'AFS CLT Mexico City',
    twoCode: 'MX',
    unicode: 'U+1F1F2 U+1F1FD',
    name: 'Mexico (Mexico City)',
    emoji: '🇲🇽'
  },
  {
    code: 'AFS CLT El Paso',
    twoCode: 'MX',
    unicode: 'U+1F1F2 U+1F1FD',
    name: 'El Paso',
    emoji: '🇲🇽'
  },
  {
    code: 'colombia',
    twoCode: 'CO',
    unicode: 'U+1F1E8 U+1F1F4',
    name: 'Colombia',
    emoji: '🇨🇴'
  },
  {
    code: 'AFS CLT Bogota',
    twoCode: 'CO',
    unicode: 'U+1F1E8 U+1F1F4',
    name: 'Colombia (Bogota)',
    emoji: '🇨🇴'
  },
  {
    code: 'brazil',
    twoCode: 'BRB',
    unicode: 'U+1F1E7 U+1F1F7',
    name: 'Brazil',
    emoji: '🇧🇷'
  },
  {
    code: 'AFS CLT Salvador',
    twoCode: 'BRB',
    unicode: 'U+1F1E7 U+1F1F7',
    name: 'Brazil (Salvador)',
    emoji: '🇧🇷'
  },
  {
    code: 'AFS CLT Rio de Janeiro',
    twoCode: 'BRR',
    unicode: 'U+1F1E7 U+1F1F7',
    name: 'Brazil (Rio de Janeiro)',
    emoji: '🇧🇷'
  },
  {
    code: 'argentina',
    twoCode: 'AR',
    unicode: 'U+1F1E6 U+1F1F7',
    name: 'Argentina',
    emoji: '🇦🇷'
  },
  {
    code: 'AFS CLT Buenos Aires',
    twoCode: 'AR',
    unicode: 'U+1F1E6 U+1F1F7',
    name: 'Argentina (Buenos Aires)',
    emoji: '🇦🇷'
  },
  {
    code: 'portugal',
    twoCode: 'PT',
    unicode: 'U+1F1F5 U+1F1F9',
    name: 'Portugal',
    emoji: '🇵🇹'
  },
  {
    code: 'AFS CLT Porto',
    twoCode: 'PT',
    unicode: 'U+1F1F5 U+1F1F9',
    name: 'Portugal (Porto)',
    emoji: '🇵🇹'
  },
  {
    code: 'spain',
    twoCode: 'ES',
    unicode: 'U+1F1EA U+1F1F8',
    name: 'Spain',
    emoji: '🇪🇸'
  },
  {
    code: 'AFS CLT Madrid',
    twoCode: 'ES',
    unicode: 'U+1F1EA U+1F1F8',
    name: 'Spain (Madrid)',
    emoji: '🇪🇸'
  },
  {
    code: 'uk',
    twoCode: 'GB',
    unicode: 'U+1F1EC U+1F1E7',
    name: 'United Kingdom',
    emoji: '🇬🇧'
  },
  {
    code: 'AFS CLT London',
    twoCode: 'GB',
    unicode: 'U+1F1EC U+1F1E7',
    name: 'London',
    emoji: '🇬🇧'
  },
  {
    code: 'italy',
    twoCode: 'ITR',
    unicode: 'U+1F1EE U+1F1F9',
    name: 'Italy',
    emoji: '🇮🇹'
  },
  {
    code: 'AFS CLT Rome',
    twoCode: 'ITR',
    unicode: 'U+1F1EE U+1F1F9',
    name: 'Italy (Rome)',
    emoji: '🇮🇹'
  },
  {
    code: 'AFS CLT Milan',
    twoCode: 'ITM',
    unicode: 'U+1F1EE U+1F1F9',
    name: 'Italy (Milano)',
    emoji: '🇮🇹'
  },
  {
    code: 'germany',
    twoCode: 'DE',
    unicode: 'U+1F1E9 U+1F1EA',
    name: 'Germany',
    emoji: '🇩🇪'
  },
  {
    code: 'AFS CLT Berlin',
    twoCode: 'DE',
    unicode: 'U+1F1E9 U+1F1EA',
    name: 'Germany (Berlin)',
    emoji: '🇩🇪'
  },
  {
    code: 'russia',
    twoCode: 'RUM',
    unicode: 'U+1F1F7 U+1F1FA',
    name: 'Russia',
    emoji: '🇷🇺'
  },
  {
    code: 'AFS CLT Moscow',
    twoCode: 'RUM',
    unicode: 'U+1F1F7 U+1F1FA',
    name: 'Russia (Moscow)',
    emoji: '🇷🇺'
  },
  {
    code: 'AFS CLT Saint Petersburg',
    twoCode: 'RUS',
    unicode: 'U+1F1F7 U+1F1FA',
    name: 'Russia (Saint Petersburg)',
    emoji: '🇷🇺'
  },
  {
    code: 'china',
    twoCode: 'CNC',
    unicode: 'U+1F1E8 U+1F1F3',
    name: 'Mainland China (Coastal)',
    emoji: '🇨🇳'
  },
  {
    code: 'AFS CLT Shanghai',
    twoCode: 'CNC',
    unicode: 'U+1F1E8 U+1F1F3',
    name: 'China (Shanghai)',
    emoji: '🇨🇳'
  },
  {
    code: 'vietnam',
    twoCode: 'VNC',
    unicode: 'U+1F1FB U+1F1F3',
    name: 'Vietnam',
    emoji: '🇻🇳'
  },
  {
    code: 'AFS CLT HCMC',
    twoCode: 'VNC',
    unicode: 'U+1F1FB U+1F1F3',
    name: 'Vietnam (HCMC)',
    emoji: '🇻🇳'
  },
  {
    code: 'AFS CLT Hanoi',
    twoCode: 'VNH',
    unicode: 'U+1F1FB U+1F1F3',
    name: 'Vietnam (Hanoi)',
    emoji: '🇻🇳'
  },
  {
    code: 'philippines',
    twoCode: 'PH',
    unicode: 'U+1F1F5 U+1F1ED',
    name: 'Philippines',
    emoji: '🇵🇭'
  },
  {
    code: 'AFS CLT Manila',
    twoCode: 'PH',
    unicode: 'U+1F1F5 U+1F1ED',
    name: 'Philippines (Manila)',
    emoji: '🇵🇭'
  },
  {
    code: 'indonesia',
    twoCode: 'ID',
    unicode: 'U+1F1EE U+1F1E9',
    name: 'Indonesia',
    emoji: '🇮🇩'
  },
  {
    code: 'japan',
    twoCode: 'JP',
    unicode: 'U+1F1EF U+1F1F5',
    name: 'Japan',
    emoji: '🇯🇵'
  },
  {
    code: 'thailand',
    twoCode: 'TH',
    unicode: 'U+1F1F9 U+1F1ED',
    name: 'Thailand',
    emoji: '🇹🇭'
  },
  {
    code: 'AFS CLT Bangkok',
    twoCode: 'TH',
    unicode: 'U+1F1F9 U+1F1ED',
    name: 'Thailand (Bangkok)',
    emoji: '🇹🇭'
  },
  {
    code: 'AFS CLT Singapore',
    twoCode: 'SG',
    unicode: 'U+1F1F8 U+1F1EC',
    name: 'Singapore',
    emoji: '🇸🇬'
  },
  {
    code: 'AFS CLT Australia',
    twoCode: 'SG',
    unicode: 'U+1F1F8 U+1F1EC',
    name: 'Australia',
    emoji: '🇦🇺'
  }
];
