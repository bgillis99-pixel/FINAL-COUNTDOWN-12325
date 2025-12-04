// Grab elements
const vinInput = document.getElementById("vin-input");
const charCountEl = document.getElementById("vin-char-count");
const errorEl = document.getElementById("vin-error");
const checkBtn = document.getElementById("check-compliance-btn");
const scanBtn = document.getElementById("scan-vin-btn");
const findTesterBtn = document.getElementById("find-tester-btn");
const stickyCtaBtn = document.getElementById("sticky-cta-btn");

// Basic validation (front-end only)
function validateVin(raw) {
  const vin = raw.trim().toUpperCase();
  const len = vin.length;
  let lastSixNumeric = false;

  if (len === 17) {
    const lastSix = vin.slice(-6);
    lastSixNumeric = /^[0-9]{6}$/.test(lastSix);
  }

  return {
    vin,
    length: len,
    isValid: len === 17 && lastSixNumeric
  };
}

function updateVinUI() {
  const { length, isValid } = validateVin(vinInput.value);
  charCountEl.textContent = `${length} / 17`;
  checkBtn.disabled = !isValid;

  if (!vinInput.value) {
    errorEl.hidden = true;
  } else if (length === 17 && !isValid) {
    errorEl.hidden = false;
  } else {
    errorEl.hidden = true;
  }
}

if (vinInput) {
  vinInput.addEventListener("input", updateVinUI);
}

// TODO: Replace the placeholders below with your existing working logic.
function existingVinLookup(vin) {
  // Hook this into whatever you currently use on carbcleantruckcheck.app
  console.log("VIN lookup:", vin);
}

function existingFindTesterFlow() {
  // Hook into your current "Find a Tester" flow / page
  console.log("Find tester flow");
}

// Wire buttons to existing logic
if (checkBtn) {
  checkBtn.addEventListener("click", () => {
    const { vin, isValid } = validateVin(vinInput.value);
    if (!isValid) return;
    existingVinLookup(vin);
  });
}

if (scanBtn) {
  scanBtn.addEventListener("click", () => {
    // Call your existing Scan-VIN function
    console.log("Scan VIN pressed");
  });
}

if (findTesterBtn) {
  findTesterBtn.addEventListener("click", existingFindTesterFlow);
}

if (stickyCtaBtn) {
  stickyCtaBtn.addEventListener("click", existingFindTesterFlow);
}
