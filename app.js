/**
 * CARB Clean Truck Check - VIN Lookup Application
 * Mobile-first PWA for vehicle identification number validation and lookup
 */

// DOM Elements
const vinForm = document.getElementById('vinForm');
const vinInput = document.getElementById('vinInput');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const inputHint = document.getElementById('inputHint');
const results = document.getElementById('results');
const resultContent = document.getElementById('resultContent');
const errorElement = document.getElementById('error');

// VIN Validation Constants
const VIN_LENGTH = 17;
const INVALID_CHARS = /[IOQioq]/; // I, O, Q are not allowed in VINs
const VALID_VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/i;

/**
 * VIN Validation Function
 * @param {string} vin - The VIN to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
function validateVIN(vin) {
    if (!vin || vin.length === 0) {
        return { isValid: false, message: '' };
    }

    if (vin.length < VIN_LENGTH) {
        return {
            isValid: false,
            message: `${vin.length}/${VIN_LENGTH} characters`
        };
    }

    if (INVALID_CHARS.test(vin)) {
        return {
            isValid: false,
            message: 'VIN cannot contain I, O, or Q'
        };
    }

    if (!VALID_VIN_PATTERN.test(vin)) {
        return {
            isValid: false,
            message: 'Invalid VIN format'
        };
    }

    return {
        isValid: true,
        message: 'Valid VIN format ✓'
    };
}

/**
 * Perform VIN lookup
 * @param {string} vin - The VIN to lookup
 * @returns {Promise<object>} - Vehicle information
 */
async function lookupVIN(vin) {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for demonstration
    // In production, this would call a real CARB API endpoint
    const mockData = {
        vin: vin.toUpperCase(),
        year: '2022',
        make: 'PETERBILT',
        model: '579',
        gvwr: '80,000 lbs',
        fuelType: 'Diesel',
        engineModel: 'PACCAR MX-13',
        compliance: 'Compliant',
        complianceDate: '2022-01-15',
        status: 'Active',
        certificationNumber: 'CARB-2022-' + vin.slice(-6)
    };

    // Simulate occasional errors
    if (vin.endsWith('ERROR')) {
        throw new Error('Vehicle not found in CARB database');
    }

    return mockData;
}

/**
 * Display vehicle information
 * @param {object} data - Vehicle data to display
 */
function displayResults(data) {
    const items = [
        { label: 'VIN', value: data.vin },
        { label: 'Year', value: data.year },
        { label: 'Make', value: data.make },
        { label: 'Model', value: data.model },
        { label: 'GVWR', value: data.gvwr },
        { label: 'Fuel Type', value: data.fuelType },
        { label: 'Engine', value: data.engineModel },
        { label: 'Status', value: data.status },
        { label: 'CARB Compliance', value: data.compliance },
        { label: 'Compliance Date', value: data.complianceDate },
        { label: 'Cert Number', value: data.certificationNumber }
    ];

    resultContent.innerHTML = items.map(item => `
        <div class="result-item">
            <span class="result-label">${item.label}</span>
            <span class="result-value">${item.value}</span>
        </div>
    `).join('');

    vinForm.classList.add('hidden');
    results.classList.remove('hidden');
    errorElement.classList.add('hidden');
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    results.classList.add('hidden');
}

/**
 * Clear error message
 */
function clearError() {
    errorElement.classList.add('hidden');
}

/**
 * Reset form to initial state
 */
function resetForm() {
    vinForm.classList.remove('hidden');
    results.classList.add('hidden');
    errorElement.classList.add('hidden');
    vinInput.value = '';
    vinInput.focus();
    updateInputHint('');
}

/**
 * Update input hint message
 * @param {string} message - Hint message
 * @param {string} type - Type of hint ('error', 'success', or '')
 */
function updateInputHint(message, type = '') {
    inputHint.textContent = message;
    inputHint.className = 'input-hint';
    if (type) {
        inputHint.classList.add(type);
    }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleSubmit(e) {
    e.preventDefault();

    const vin = vinInput.value.trim().toUpperCase();
    const validation = validateVIN(vin);

    if (!validation.isValid) {
        displayError(validation.message || 'Please enter a valid 17-character VIN');
        return;
    }

    clearError();

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';

    try {
        const vehicleData = await lookupVIN(vin);
        displayResults(vehicleData);
    } catch (error) {
        displayError(error.message || 'An error occurred while looking up the VIN. Please try again.');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Check VIN';
    }
}

/**
 * Handle input changes for real-time validation
 */
function handleInput() {
    const vin = vinInput.value.trim().toUpperCase();
    vinInput.value = vin; // Auto-uppercase

    const validation = validateVIN(vin);

    if (vin.length === 0) {
        updateInputHint('');
        submitBtn.disabled = false;
    } else if (validation.isValid) {
        updateInputHint(validation.message, 'success');
        submitBtn.disabled = false;
    } else {
        updateInputHint(validation.message, 'error');
        submitBtn.disabled = vin.length === VIN_LENGTH;
    }

    clearError();
}

// Event Listeners
vinForm.addEventListener('submit', handleSubmit);
vinInput.addEventListener('input', handleInput);
resetBtn.addEventListener('click', resetForm);

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
});

// Service Worker Registration (if you add one later)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Auto-focus input on page load
window.addEventListener('load', () => {
    vinInput.focus();
});
