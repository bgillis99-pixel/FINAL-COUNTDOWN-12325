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
        try {
            const cleanZip = (zip || "").trim();
            if (!/^[0-9]{5}$/.test(cleanZip)) {
                throw new Error("Invalid ZIP format. Please enter a 5-digit ZIP code.");
            }

            // TODO: REPLACE with real data
            // Example shape if using a local map:
            // const county = ZIP_TO_COUNTY[cleanZip];
            // if (!county) throw new Error("ZIP code not found in database");
            // return { zip: cleanZip, county };

            // Example if using an API:
            // try {
            //   const response = await fetch(`/api/zip-lookup?zip=${cleanZip}`);
            //   if (!response.ok) {
            //     throw new Error(`API returned ${response.status}: ${response.statusText}`);
            //   }
            //   const data = await response.json();
            //   if (!data.county) {
            //     throw new Error("ZIP code not found in database");
            //   }
            //   return { zip: cleanZip, county: data.county };
            // } catch (fetchErr) {
            //   console.error("ZIP lookup API error:", fetchErr);
            //   throw new Error("Unable to connect to ZIP lookup service. Please try again.");
            // }

            // Temporary placeholder for testing:
            return {
                zip: cleanZip,
                county: "Sacramento"
            };
        } catch (err) {
            console.error("lookupCountyByZip error:", err.message);
            throw err; // Re-throw to be handled by caller
        }
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
      if (!zipInput) {
        console.error("ZIP input element not found");
        return;
      }

      const zip = zipInput.value.trim();
      if (!/^[0-9]{5}$/.test(zip)) {
        zipError.textContent = "Please enter a valid 5-digit ZIP code.";
        zipError.hidden = false;
        testerResult.hidden = true;
        return;
      }
      zipError.hidden = true;
      testerResult.hidden = true;

      try {
        // 1) Look up county
        const { county } = await lookupCountyByZip(zip);

        if (!county) {
          throw new Error("County data not available for this ZIP code.");
        }

        // 2) Pick phone number
        const phone = getPhoneForCounty(county);

        if (!phone) {
          console.error("No phone number found for county:", county);
          throw new Error("Contact information not available for this county.");
        }

        // 3) Update UI
        testerCountyLine.textContent = `ZIP ${zip} is in ${county} County.`;
        testerPhoneLine.textContent = `Your NorCal contact: ${phone}`;
        testerCallLink.href = `tel:${phone.replace(/[^0-9+]/g, "")}`;

        testerResult.hidden = false;

        // 4) Optional: send event to your existing system
        // existingFindTesterFlow(zip, county, phone);
      } catch (err) {
        console.error("handleFindTesterZip error:", err.message);

        // Provide specific error messages based on error type
        let errorMessage = "We couldn't look up that ZIP. Please try again.";

        if (err.message.includes("Invalid ZIP")) {
          errorMessage = "Please enter a valid 5-digit ZIP code.";
        } else if (err.message.includes("not found")) {
          errorMessage = "ZIP code not found. Please verify and try again.";
        } else if (err.message.includes("connect") || err.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message.includes("County data") || err.message.includes("Contact information")) {
          errorMessage = err.message; // Use the specific error message
        }

        zipError.textContent = errorMessage;
        zipError.hidden = false;
        testerResult.hidden = true;
      }
    }

    if (zipSubmitBtn) {
      zipSubmitBtn.addEventListener("click", handleFindTesterZip);
    }

});