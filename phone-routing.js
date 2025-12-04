/******************************
 * PHONE ROUTING CONFIG
 ******************************/

// Core phones
const PHONE_DEFAULT = "617-359-6953";     // fallback / for now
const PHONE_INLAND_NORTH = "916-890-4427";
const PHONE_COAST = "415-900-8563";

// Coastal band: Monterey → Fort Bragg, inland to Richmond.
// Adjust this list as needed – it's intentionally explicit.
const COASTAL_COUNTIES = new Set([
  "Monterey",
  "San Benito",
  "Santa Cruz",
  "Santa Clara",      // south bay
  "San Mateo",
  "San Francisco",
  "Marin",
  "Sonoma",
  "Mendocino"         // up to Fort Bragg
]);

// Inland counties that should still route to the COAST number because
// they're "inland to Richmond" (Bay inner ring)
const COASTAL_INLAND_TO_RICHMOND = new Set([
  "Alameda",
  "Contra Costa"      // includes Richmond
]);

// Counties that are Fresno and north / east to Nevada get the 916 number.
// This is not exhaustive – your dev can expand.
const INLAND_NORTH_COUNTIES = new Set([
  "Fresno",
  "Madera",
  "Merced",
  "Stanislaus",
  "San Joaquin",
  "Sacramento",
  "Solano",
  "Yolo",
  "Placer",
  "El Dorado",
  "Nevada",
  "Sutter",
  "Yuba",
  "Butte",
  "Colusa",
  "Glenn",
  "Tehama",
  "Shasta",
  "Plumas",
  "Sierra",
  "Lassen",
  "Modoc",
  "Trinity",
  "Humboldt",   // you can argue this is coastal – pick one
  "Lake"
]);

/**
 * Decide which phone number to use based on county.
 * @param {string} countyName - County name like "Sacramento"
 * @returns {string} - Phone number for the county
 */
function getPhoneForCounty(countyName) {
  if (!countyName) return PHONE_DEFAULT;

  const c = countyName.trim();
  if (COASTAL_COUNTIES.has(c) || COASTAL_INLAND_TO_RICHMOND.has(c)) {
    return PHONE_COAST;
  }
  if (INLAND_NORTH_COUNTIES.has(c)) {
    return PHONE_INLAND_NORTH;
  }
  // Fallback "for now"
  return PHONE_DEFAULT;
}

/**
 * Format phone number for display (e.g., "916-890-4427" → "(916) 890-4427")
 * @param {string} phoneNumber - Phone number in format XXX-XXX-XXXX
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

/**
 * Get a list of all counties and their assigned phone numbers
 * @returns {Array<{county: string, phone: string, region: string}>}
 */
function getAllCountyPhoneMappings() {
  const mappings = [];

  COASTAL_COUNTIES.forEach(county => {
    mappings.push({
      county: county,
      phone: PHONE_COAST,
      region: 'Coastal'
    });
  });

  COASTAL_INLAND_TO_RICHMOND.forEach(county => {
    mappings.push({
      county: county,
      phone: PHONE_COAST,
      region: 'Coastal (Inland to Richmond)'
    });
  });

  INLAND_NORTH_COUNTIES.forEach(county => {
    mappings.push({
      county: county,
      phone: PHONE_INLAND_NORTH,
      region: 'Inland North'
    });
  });

  return mappings.sort((a, b) => a.county.localeCompare(b.county));
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PHONE_DEFAULT,
    PHONE_INLAND_NORTH,
    PHONE_COAST,
    getPhoneForCounty,
    formatPhoneNumber,
    getAllCountyPhoneMappings
  };
}
