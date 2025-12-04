/**
 * CARB Clean Truck Check - VIN Validation Application
 * Validates Vehicle Identification Numbers (VINs) for compliance checking
 */

// ============================
// DOM Elements
// ============================
const vinInput = document.getElementById('vin-input');
const vinCharCount = document.getElementById('vin-char-count');
const vinError = document.getElementById('vin-error');
const checkComplianceBtn = document.getElementById('check-compliance-btn');
const scanVinBtn = document.getElementById('scan-vin-btn');
const findTesterBtn = document.getElementById('find-tester-btn');

// ============================
// Constants
// ============================
const VIN_LENGTH = 17;
const VIN_LAST_DIGITS = 6;

// ============================
// VIN Validation Logic
// ============================

/**
 * Validates if a VIN meets CARB requirements
 * - Must be exactly 17 characters
 * - Last 6 characters must be numeric
 * @param {string} vin - The VIN to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidVIN(vin) {
  if (!vin || vin.length !== VIN_LENGTH) {
    return false;
  }

  // Extract last 6 characters
  const lastSix = vin.slice(-VIN_LAST_DIGITS);

  // Check if last 6 characters are all digits
  const isNumeric = /^\d{6}$/.test(lastSix);

  return isNumeric;
}

/**
 * Sanitizes VIN input by removing invalid characters
 * VINs typically exclude I, O, Q to avoid confusion with 1, 0
 * @param {string} value - The input value
 * @returns {string} - Sanitized VIN
 */
function sanitizeVIN(value) {
  // Convert to uppercase and remove spaces
  return value.toUpperCase().replace(/\s/g, '');
}

// ============================
// UI Update Functions
// ============================

/**
 * Updates the character count display
 * @param {number} count - Current character count
 */
function updateCharCount(count) {
  vinCharCount.textContent = `${count} / ${VIN_LENGTH}`;

  // Visual feedback for character count
  if (count === 0) {
    vinCharCount.style.color = 'var(--gray-600)';
  } else if (count === VIN_LENGTH) {
    vinCharCount.style.color = 'var(--success-green)';
    vinCharCount.style.fontWeight = '700';
  } else {
    vinCharCount.style.color = 'var(--primary-blue)';
    vinCharCount.style.fontWeight = '600';
  }
}

/**
 * Shows or hides the error message
 * @param {boolean} show - Whether to show the error
 */
function toggleError(show) {
  if (show) {
    vinError.hidden = false;
    vinInput.classList.add('error');
  } else {
    vinError.hidden = true;
    vinInput.classList.remove('error');
  }
}

/**
 * Enables or disables the check compliance button
 * @param {boolean} enabled - Whether the button should be enabled
 */
function toggleCheckButton(enabled) {
  checkComplianceBtn.disabled = !enabled;
}

/**
 * Validates and updates UI based on current VIN input
 */
function validateAndUpdate() {
  const vin = vinInput.value;
  const length = vin.length;

  // Update character count
  updateCharCount(length);

  // Validate VIN
  if (length === 0) {
    // No input - hide error, disable button
    toggleError(false);
    toggleCheckButton(false);
  } else if (length === VIN_LENGTH) {
    // Full length - validate format
    const valid = isValidVIN(vin);
    toggleError(!valid);
    toggleCheckButton(valid);
  } else {
    // Partial input - hide error, disable button
    toggleError(false);
    toggleCheckButton(false);
  }
}

// ============================
// Event Handlers
// ============================

/**
 * Handles VIN input changes
 * @param {Event} e - Input event
 */
function handleVINInput(e) {
  // Sanitize input
  const sanitized = sanitizeVIN(e.target.value);

  // Update input if sanitization changed the value
  if (sanitized !== e.target.value) {
    vinInput.value = sanitized;
  }

  // Validate and update UI
  validateAndUpdate();
}

/**
 * Handles VIN input paste events
 * @param {ClipboardEvent} e - Paste event
 */
function handleVINPaste(e) {
  e.preventDefault();

  // Get pasted text
  const pastedText = (e.clipboardData || window.clipboardData).getData('text');

  // Sanitize and truncate to max length
  const sanitized = sanitizeVIN(pastedText).slice(0, VIN_LENGTH);

  // Set input value
  vinInput.value = sanitized;

  // Validate and update UI
  validateAndUpdate();
}

/**
 * Handles scan VIN button click
 */
async function handleScanVIN() {
  console.log('Scan VIN clicked');

  // Check if browser supports camera access
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera access is not supported in this browser. Please enter VIN manually.');
    return;
  }

  try {
    // Request camera permission
    // This is a placeholder - actual VIN scanning would require
    // integration with a barcode/OCR library like QuaggaJS or Tesseract.js
    alert('VIN scanning feature coming soon!\n\nFor now, please enter the VIN manually.');

    // Future implementation would:
    // 1. Request camera access
    // 2. Open camera view
    // 3. Use OCR/barcode scanning library
    // 4. Extract VIN from image
    // 5. Populate input field

  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please check permissions and try again.');
  }
}

/**
 * Handles check compliance button click
 */
async function handleCheckCompliance() {
  const vin = vinInput.value;

  if (!isValidVIN(vin)) {
    alert('Please enter a valid 17-character VIN with last 6 digits numeric.');
    return;
  }

  console.log('Checking compliance for VIN:', vin);

  // Show loading state
  checkComplianceBtn.textContent = 'Checking...';
  checkComplianceBtn.disabled = true;

  try {
    // Placeholder for API call to CARB compliance database
    // In production, this would call an actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    // Simulated response
    const isCompliant = Math.random() > 0.5; // Random result for demo

    if (isCompliant) {
      alert(`✅ VIN ${vin} is COMPLIANT\n\nThis vehicle meets CARB clean truck requirements.`);
    } else {
      alert(`⚠️ VIN ${vin} requires inspection\n\nThis vehicle may need testing. Click "Find a Tester" to locate nearby certified testers.`);
    }

  } catch (error) {
    console.error('Error checking compliance:', error);
    alert('Unable to check compliance. Please try again later.');
  } finally {
    // Restore button state
    checkComplianceBtn.textContent = 'Check Compliance';
    checkComplianceBtn.disabled = false;
  }
}

/**
 * Handles find tester button click
 */
function handleFindTester() {
  console.log('Find tester clicked');

  // Prompt for ZIP code
  const zip = prompt('Enter your ZIP code to find certified testers near you:');

  if (!zip) {
    return; // User cancelled
  }

  // Validate ZIP code (basic 5-digit validation)
  const zipPattern = /^\d{5}$/;
  if (!zipPattern.test(zip)) {
    alert('Please enter a valid 5-digit ZIP code.');
    return;
  }

  console.log('Finding testers near ZIP:', zip);

  // Placeholder for tester search functionality
  // In production, this would:
  // 1. Call an API to find nearby testers
  // 2. Display results in a modal or new page
  // 3. Show tester details (name, address, phone, distance)

  alert(`Searching for certified CARB testers near ${zip}...\n\nThis feature is coming soon!\n\nFor now, visit ww2.arb.ca.gov/our-work/programs/heavy-duty-inspection-and-maintenance-program to find testers.`);
}

// ============================
// Event Listeners
// ============================

// VIN input events
vinInput.addEventListener('input', handleVINInput);
vinInput.addEventListener('paste', handleVINPaste);

// Button click events
scanVinBtn.addEventListener('click', handleScanVIN);
checkComplianceBtn.addEventListener('click', handleCheckCompliance);
findTesterBtn.addEventListener('click', handleFindTester);

// ============================
// Keyboard Shortcuts
// ============================

// Allow Enter key to check compliance when VIN is valid
vinInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !checkComplianceBtn.disabled) {
    handleCheckCompliance();
  }
});

// ============================
// Initialization
// ============================

/**
 * Initialize the application
 */
function init() {
  console.log('CARB Clean Truck Check initialized');

  // Set initial state
  updateCharCount(0);
  toggleCheckButton(false);
  toggleError(false);

  // Focus on VIN input for better UX
  vinInput.focus();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================
// Utility Functions
// ============================

/**
 * Decodes a VIN to extract vehicle information
 * This is a simplified version - real VIN decoding is more complex
 * @param {string} vin - The VIN to decode
 * @returns {object} - Decoded VIN information
 */
function decodeVIN(vin) {
  if (!vin || vin.length !== VIN_LENGTH) {
    return null;
  }

  return {
    wmi: vin.substring(0, 3),        // World Manufacturer Identifier
    vds: vin.substring(3, 9),        // Vehicle Descriptor Section
    vis: vin.substring(9, 17),       // Vehicle Identifier Section
    year: vin.charAt(9),             // Model Year
    plant: vin.charAt(10),           // Manufacturing Plant
    serial: vin.substring(11, 17)    // Serial Number
  };
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidVIN,
    sanitizeVIN,
    decodeVIN
  };
}
