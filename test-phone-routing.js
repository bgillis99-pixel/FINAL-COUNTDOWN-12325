/**
 * Test script for phone routing functionality
 */

// Load the phone routing module
const fs = require('fs');
const vm = require('vm');

// Read and execute the phone-routing.js file
const phoneRoutingCode = fs.readFileSync('./phone-routing.js', 'utf8');
const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(phoneRoutingCode, sandbox);

const {
  PHONE_DEFAULT,
  PHONE_INLAND_NORTH,
  PHONE_COAST,
  getPhoneForCounty,
  formatPhoneNumber,
  getAllCountyPhoneMappings
} = sandbox.module.exports;

console.log('=== Phone Routing Tests ===\n');

// Test 1: Coastal counties
console.log('Test 1: Coastal Counties');
const coastalTests = ['San Francisco', 'Monterey', 'Marin', 'Santa Cruz'];
coastalTests.forEach(county => {
  const phone = getPhoneForCounty(county);
  console.log(`  ${county}: ${formatPhoneNumber(phone)} - ${phone === PHONE_COAST ? '✓' : '✗'}`);
});

console.log('\nTest 2: Coastal Inland (Richmond Area)');
const richmondTests = ['Alameda', 'Contra Costa'];
richmondTests.forEach(county => {
  const phone = getPhoneForCounty(county);
  console.log(`  ${county}: ${formatPhoneNumber(phone)} - ${phone === PHONE_COAST ? '✓' : '✗'}`);
});

console.log('\nTest 3: Inland North Counties');
const inlandTests = ['Sacramento', 'Fresno', 'Placer', 'Yuba'];
inlandTests.forEach(county => {
  const phone = getPhoneForCounty(county);
  console.log(`  ${county}: ${formatPhoneNumber(phone)} - ${phone === PHONE_INLAND_NORTH ? '✓' : '✗'}`);
});

console.log('\nTest 4: Default/Unknown Counties');
const defaultTests = ['', null, 'UnknownCounty', 'Los Angeles'];
defaultTests.forEach(county => {
  const phone = getPhoneForCounty(county);
  console.log(`  "${county}": ${formatPhoneNumber(phone)} - ${phone === PHONE_DEFAULT ? '✓' : '✗'}`);
});

console.log('\nTest 5: Phone Number Formatting');
const phoneTests = [
  { input: '617-359-6953', expected: '(617) 359-6953' },
  { input: '916-890-4427', expected: '(916) 890-4427' },
  { input: '415-900-8563', expected: '(415) 900-8563' }
];
phoneTests.forEach(test => {
  const formatted = formatPhoneNumber(test.input);
  console.log(`  ${test.input} → ${formatted} - ${formatted === test.expected ? '✓' : '✗'}`);
});

console.log('\nTest 6: Get All County Mappings');
const mappings = getAllCountyPhoneMappings();
console.log(`  Total counties mapped: ${mappings.length}`);
console.log(`  Coastal counties: ${mappings.filter(m => m.region.includes('Coastal')).length}`);
console.log(`  Inland North counties: ${mappings.filter(m => m.region === 'Inland North').length}`);

// Sample of mappings
console.log('\n  Sample mappings:');
mappings.slice(0, 5).forEach(m => {
  console.log(`    ${m.county} → ${formatPhoneNumber(m.phone)} (${m.region})`);
});

console.log('\n=== All Tests Complete ===');
