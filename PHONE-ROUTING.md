# Phone Routing Configuration

This document describes the phone routing system for CARB Clean Truck services based on California county locations.

## Overview

The phone routing system automatically assigns the appropriate phone number based on the customer's county location. This ensures customers in different regions of Northern California reach the most appropriate service provider.

## Phone Numbers

- **Coast (415-900-8563)**: Monterey → Fort Bragg coastal band, inland to Richmond
- **Inland North (916-890-4427)**: Fresno and north/east to Nevada
- **Default (617-359-6953)**: Fallback for counties not explicitly mapped

## County Mappings

### Coastal Counties → 415-900-8563

These counties are in the coastal band from Monterey to Fort Bragg:

- Monterey
- San Benito
- Santa Cruz
- Santa Clara (South Bay)
- San Mateo
- San Francisco
- Marin
- Sonoma
- Mendocino (up to Fort Bragg)

### Coastal Inland to Richmond → 415-900-8563

These inland counties are still routed to the coast number as they're part of the Bay Area inner ring:

- Alameda
- Contra Costa (includes Richmond)

### Inland North Counties → 916-890-4427

These counties from Fresno northward and east to Nevada receive the 916 number:

- Fresno
- Madera
- Merced
- Stanislaus
- San Joaquin
- Sacramento
- Solano
- Yolo
- Placer
- El Dorado
- Nevada
- Sutter
- Yuba
- Butte
- Colusa
- Glenn
- Tehama
- Shasta
- Plumas
- Sierra
- Lassen
- Modoc
- Trinity
- Humboldt
- Lake

## Usage

### JavaScript Implementation

The phone routing is implemented in `phone-routing.js` with the following key functions:

```javascript
// Get phone number for a county
const phone = getPhoneForCounty("Sacramento");
// Returns: "916-890-4427"

// Format phone number for display
const formatted = formatPhoneNumber("916-890-4427");
// Returns: "(916) 890-4427"

// Get all county mappings
const mappings = getAllCountyPhoneMappings();
// Returns array of {county, phone, region} objects
```

### Demo Page

A demonstration page is available at `phone-routing-demo.html` that includes:

1. **County Lookup Tab**: Enter or select a county to find the appropriate phone number
2. **Full County List Tab**: View all counties and their assigned phone numbers in a table

To view the demo:
```bash
open phone-routing-demo.html
```

Or serve it with a local web server:
```bash
python3 -m http.server 8000
# Then visit: http://localhost:8000/phone-routing-demo.html
```

## Integration Examples

### Example 1: Display phone based on user's location

```javascript
// After detecting user's county (via ZIP code lookup, geolocation, etc.)
const userCounty = "San Francisco";
const phoneNumber = getPhoneForCounty(userCounty);
const formattedPhone = formatPhoneNumber(phoneNumber);

// Display to user
document.getElementById('contact-phone').textContent = formattedPhone;
document.getElementById('contact-link').href = `tel:${phoneNumber}`;
```

### Example 2: County selection form

```html
<label>Select your county:</label>
<select id="county-select" onchange="updateContactPhone()">
  <option value="">-- Select --</option>
  <option value="Sacramento">Sacramento</option>
  <option value="San Francisco">San Francisco</option>
  <!-- etc -->
</select>

<div id="contact-info" style="display:none;">
  Call us at: <a id="phone-link" href=""></a>
</div>

<script>
function updateContactPhone() {
  const county = document.getElementById('county-select').value;
  if (county) {
    const phone = getPhoneForCounty(county);
    const formatted = formatPhoneNumber(phone);
    document.getElementById('phone-link').textContent = formatted;
    document.getElementById('phone-link').href = `tel:${phone}`;
    document.getElementById('contact-info').style.display = 'block';
  }
}
</script>
```

### Example 3: Integration with VIN checker

```javascript
// After VIN check, if user needs to contact support
function showContactForCounty(countyName) {
  const phone = getPhoneForCounty(countyName);
  const formatted = formatPhoneNumber(phone);

  alert(`For assistance in ${countyName} County, please call: ${formatted}`);
}
```

## Expanding the County List

To add or modify county mappings, edit `phone-routing.js`:

1. For coastal counties, add to `COASTAL_COUNTIES` Set
2. For coastal inland (Richmond area), add to `COASTAL_INLAND_TO_RICHMOND` Set
3. For inland north counties, add to `INLAND_NORTH_COUNTIES` Set

Example:
```javascript
const COASTAL_COUNTIES = new Set([
  "Monterey",
  "San Benito",
  // ... existing counties ...
  "NewCounty"  // Add here
]);
```

## Notes

- County names are case-sensitive and should match the standard California county names
- The system uses JavaScript Sets for O(1) lookup performance
- Unmatched counties fall back to the default number (617-359-6953)
- The mapping is intentionally explicit rather than using geographic calculations for clarity and reliability

## Testing

Test the phone routing with various county names:

```javascript
console.log(getPhoneForCounty("Sacramento"));      // 916-890-4427
console.log(getPhoneForCounty("San Francisco"));   // 415-900-8563
console.log(getPhoneForCounty("Alameda"));         // 415-900-8563
console.log(getPhoneForCounty("Fresno"));          // 916-890-4427
console.log(getPhoneForCounty("Unknown"));         // 617-359-6953
```

## Files

- `phone-routing.js` - Core routing logic and configuration
- `phone-routing-demo.html` - Interactive demo page
- `PHONE-ROUTING.md` - This documentation file
