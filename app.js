document.addEventListener('DOMContentLoaded', () => {
    /******************************
     * PHONE ROUTING CONFIG
     ******************************/

    // Core phones
    const PHONE_DEFAULT = "617-359-6953"; // fallback / for now
    const PHONE_INLAND_NORTH = "916-890-4427";
    const PHONE_COAST = "415-900-8563";

    // Coastal band: Monterey → Fort Bragg, inland to Richmond.
    // Adjust this list as needed – it’s intentionally explicit.
    const COASTAL_COUNTIES = new Set([
        "Monterey",
        "San Benito",
        "Santa Cruz",
        "Santa Clara", // south bay
        "San Mateo",
        "San Francisco",
        "Marin",
        "Sonoma",
        "Mendocino" // up to Fort Bragg
    ]);

    // Inland counties that should still route to the COAST number because
    // they're "inland to Richmond" (Bay inner ring)
    const COASTAL_INLAND_TO_RICHMOND = new Set([
        "Alameda",
        "Contra Costa" // includes Richmond
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
        "Humboldt", // you can argue this is coastal – pick one
        "Lake"
    ]);

    /**
     * Decide which phone number to use based on county.
     * countyName: string like "Sacramento"
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
     * Look up county by ZIP.
     * For now this is a stub – dev should replace with real implementation
     * (local JSON map or API call).
     */
    async function lookupCountyByZip(zip) {
        const cleanZip = (zip || "").trim();
        if (!/^[0-9]{5}$/.test(cleanZip)) {
            throw new Error("Invalid ZIP");
        }

        // TODO: REPLACE with real data
        // Example shape if using a local map:
        // const county = ZIP_TO_COUNTY[cleanZip];
        // if (!county) throw new Error("ZIP not found");
        // return { zip: cleanZip, county };

        // Temporary placeholder for testing:
        return {
            zip: cleanZip,
            county: "Sacramento"
        };
    }


    // Grab elements
    const vinInput = document.getElementById("vin-input");
    const charCountEl = document.getElementById("vin-char-count");
    const errorEl = document.getElementById("vin-error");
    const checkBtn = document.getElementById("check-compliance-btn");
    const scanBtn = document.getElementById("scan-vin-btn");
    const findTesterBtn = document.getElementById("find-tester-btn");
    const stickyCtaBtn = document.getElementById("sticky-cta-btn");
    const zipInput = document.getElementById("zip-input");
    const zipError = document.getElementById("zip-error");
    const zipSubmitBtn = document.getElementById("zip-submit-btn");
    const testerResult = document.getElementById("tester-result");
    const testerCountyLine = document.getElementById("tester-county-line");
    const testerPhoneLine = document.getElementById("tester-phone-line");
    const testerCallLink = document.getElementById("tester-call-link");

    async function handleFindTesterZip() {
      if (!zipInput) return;

      const zip = zipInput.value.trim();
      if (!/^[0-9]{5}$/.test(zip)) {
        zipError.hidden = false;
        testerResult.hidden = true;
        return;
      }
      zipError.hidden = true;

      try {
        // 1) Look up county
        const { county } = await lookupCountyByZip(zip);

        // 2) Pick phone number
        const phone = getPhoneForCounty(county);

        // 3) Update UI
        testerCountyLine.textContent = `ZIP ${zip} is in ${county} County.`;
        testerPhoneLine.textContent = `Your NorCal contact: ${phone}`;
        testerCallLink.href = `tel:${phone.replace(/[^0-9+]/g, "")}`;

        testerResult.hidden = false;

        // 4) Optional: send event to your existing system
        // existingFindTesterFlow(zip, county, phone);
      } catch (err) {
        console.error(err);
        zipError.textContent = "We couldn't look up that ZIP. Please try again.";
        zipError.hidden = false;
        testerResult.hidden = true;
      }
    }

    if (zipSubmitBtn) {
      zipSubmitBtn.addEventListener("click", handleFindTesterZip);
    }

    /******************************
     * VIN INPUT VALIDATION
     ******************************/

    /**
     * Validates VIN format:
     * - Must be exactly 17 characters
     * - Last 6 characters must be numeric
     */
    function validateVIN(vin) {
        if (!vin || vin.length !== 17) {
            return false;
        }
        // Last 6 characters must be numeric
        const lastSix = vin.slice(-6);
        return /^[0-9]{6}$/.test(lastSix);
    }

    /**
     * Updates character count display
     */
    function updateCharCount() {
        if (!vinInput || !charCountEl) return;

        const length = vinInput.value.length;
        charCountEl.textContent = `${length} / 17`;
    }

    /**
     * Validates VIN and updates UI state
     */
    function handleVINInput() {
        if (!vinInput || !errorEl || !checkBtn) return;

        const vin = vinInput.value.toUpperCase().trim();
        const isValid = validateVIN(vin);

        // Update character count
        updateCharCount();

        // Show/hide error
        if (vin.length > 0 && vin.length === 17 && !isValid) {
            errorEl.hidden = false;
            checkBtn.disabled = true;
        } else {
            errorEl.hidden = true;
            checkBtn.disabled = !isValid;
        }
    }

    // Add event listeners for VIN input
    if (vinInput) {
        vinInput.addEventListener("input", handleVINInput);
        vinInput.addEventListener("paste", () => {
            // Small delay to let paste complete
            setTimeout(handleVINInput, 10);
        });

        // Normalize to uppercase as user types
        vinInput.addEventListener("input", (e) => {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            e.target.value = e.target.value.toUpperCase();
            e.target.setSelectionRange(start, end);
        });
    }

    // Add placeholder handler for Check Compliance button
    if (checkBtn) {
        checkBtn.addEventListener("click", () => {
            const vin = vinInput.value.toUpperCase().trim();
            if (validateVIN(vin)) {
                // TODO: Integrate with existing CARB compliance check system
                alert(`VIN ${vin} ready for compliance check.\n\nThis would connect to your existing CARB compliance API.`);
            }
        });
    }

    // Add placeholder handler for Scan VIN button
    if (scanBtn) {
        scanBtn.addEventListener("click", () => {
            // TODO: Integrate with camera/barcode scanner
            alert("Camera scanning would be integrated here.\n\nThis could use the device camera or a barcode scanning library.");
        });
    }

});