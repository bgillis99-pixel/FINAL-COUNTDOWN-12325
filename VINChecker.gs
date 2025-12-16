/**
 * CARB VIN Compliance Checker for Google Sheets
 *
 * This script checks VINs against the CARB Clean Truck Check website
 * and updates the spreadsheet with compliance status (Y/N/Error).
 *
 * Usage:
 * 1. Place VINs in Column A (starting from row 2)
 * 2. Results will appear in Column B
 * 3. Run checkAllVINs() function
 *
 * Error Handling:
 * - Network failures are logged and return "Error"
 * - Invalid VINs are skipped with a blank result
 * - Timeout issues are caught and logged
 * - Rate limiting: 1 second delay between requests
 */

/**
 * Main function - Processes all VINs in the spreadsheet
 *
 * Iterates through all rows, validates VINs, and checks compliance status.
 * Skips rows that already have results (Y/N) to avoid duplicate checks.
 */
function checkAllVINs() {
  let sheet, range, values;

  try {
    sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      throw new Error("No active sheet found. Please open a spreadsheet.");
    }

    range = sheet.getDataRange();
    values = range.getValues();

    if (values.length <= 1) {
      SpreadsheetApp.getUi().alert("No data found. Please add VINs to column A (starting from row 2).");
      return;
    }
  } catch (err) {
    Logger.log("ERROR: Failed to access spreadsheet: " + err.message);
    SpreadsheetApp.getUi().alert("Error: Unable to access spreadsheet. " + err.message);
    return;
  }

  // Find columns (adjust if your VIN or result column moves)
  const vinCol = 0;        // Column A = index 0 (0-based)
  const resultCol = 1;     // Column B = index 1

  let processed = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 1; i < values.length; i++) { // start at row 2 (index 1)
    try {
      const vin = (values[i][vinCol] || "").toString().trim().toUpperCase();

      // Skip empty or invalid VINs
      if (vin === "") {
        sheet.getRange(i + 1, resultCol + 1).setValue(""); // clear if empty
        skipped++;
        continue;
      }

      if (vin.length !== 17) {
        Logger.log(`Row ${i + 1}: Invalid VIN length (${vin.length} chars): ${vin}`);
        sheet.getRange(i + 1, resultCol + 1).setValue("Invalid VIN");
        skipped++;
        continue;
      }

      // Validate VIN format (alphanumeric, no I, O, Q)
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        Logger.log(`Row ${i + 1}: Invalid VIN format (contains invalid characters): ${vin}`);
        sheet.getRange(i + 1, resultCol + 1).setValue("Invalid VIN");
        skipped++;
        continue;
      }

      // Skip if already has Y/N result
      const currentResult = values[i][resultCol];
      if (["Y", "N"].includes(currentResult)) {
        Logger.log(`Row ${i + 1}: Skipping VIN ${vin} - already has result: ${currentResult}`);
        skipped++;
        continue;
      }

      // Check VIN on CARB website
      Logger.log(`Row ${i + 1}: Checking VIN ${vin}...`);
      const status = checkVINonCARB(vin);

      // Update result in spreadsheet
      try {
        sheet.getRange(i + 1, resultCol + 1).setValue(status);
        Logger.log(`Row ${i + 1}: VIN ${vin} -> ${status}`);

        if (status === "Error") {
          errors++;
        } else {
          processed++;
        }

        SpreadsheetApp.flush();
      } catch (writeErr) {
        Logger.log(`ERROR writing result for row ${i + 1}: ${writeErr.message}`);
        errors++;
      }

      // Be nice to CARB server – 1 second delay
      Utilities.sleep(1000);

    } catch (rowErr) {
      Logger.log(`ERROR processing row ${i + 1}: ${rowErr.message}`);
      try {
        sheet.getRange(i + 1, resultCol + 1).setValue("Error");
      } catch (writeErr) {
        Logger.log(`ERROR: Could not write error status to row ${i + 1}: ${writeErr.message}`);
      }
      errors++;
    }
  }

  // Show completion summary
  const summary = `Done!\n\nProcessed: ${processed} VINs\nErrors: ${errors}\nSkipped: ${skipped}`;
  Logger.log(summary);
  SpreadsheetApp.getUi().alert(summary);
}


/**
 * Core function – Checks a single VIN on the CARB website
 *
 * @param {string} vin - The 17-character VIN to check
 * @returns {string} "Y" for compliant, "N" for non-compliant, "Error" for failures
 */
function checkVINonCARB(vin) {
  const url = "https://cleantruckcheck.arb.ca.gov/Fleet/Vehicle/VehicleComplianceStatusLookup";

  try {
    // Step 1: Fetch the initial page to get CSRF token
    let response;
    try {
      response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        followRedirects: true
      });
    } catch (fetchErr) {
      Logger.log(`ERROR: Network request failed for VIN ${vin}: ${fetchErr.message}`);
      return "Error: Network";
    }

    // Check response status
    const statusCode = response.getResponseCode();
    if (statusCode !== 200) {
      Logger.log(`ERROR: CARB website returned status ${statusCode} for VIN ${vin}`);
      return "Error: HTTP " + statusCode;
    }

    const html = response.getContentText();

    if (!html || html.length === 0) {
      Logger.log(`ERROR: Empty response from CARB website for VIN ${vin}`);
      return "Error: Empty response";
    }

    // Step 2: Extract CSRF token from the page
    const tokenMatch = html.match(/name=["']__RequestVerificationToken["'].*?value=["'](.*?)["']/);

    if (!tokenMatch || !tokenMatch[1]) {
      Logger.log(`ERROR: Could not find CSRF token for VIN ${vin}. Website structure may have changed.`);
      return "Error: No token";
    }

    const token = tokenMatch[1];
    Logger.log(`Found CSRF token for VIN ${vin}: ${token.substring(0, 20)}...`);

    // Step 3: Submit the VIN with the token
    const formData = {
      "Vin": vin,
      "__RequestVerificationToken": token
    };

    const options = {
      method: "post",
      payload: formData,
      followRedirects: false,
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    let postResponse;
    try {
      postResponse = UrlFetchApp.fetch(url, options);
    } catch (postErr) {
      Logger.log(`ERROR: Failed to submit VIN ${vin}: ${postErr.message}`);
      return "Error: Submit failed";
    }

    // Check POST response status
    const postStatusCode = postResponse.getResponseCode();
    if (postStatusCode >= 400) {
      Logger.log(`ERROR: CARB POST request returned status ${postStatusCode} for VIN ${vin}`);
      return "Error: HTTP " + postStatusCode;
    }

    const resultHtml = postResponse.getContentText();

    if (!resultHtml || resultHtml.length === 0) {
      Logger.log(`ERROR: Empty result from CARB website for VIN ${vin}`);
      return "Error: Empty result";
    }

    // Step 4: Parse the result page for compliance status
    // Look for the exact compliance phrase CARB uses
    if (resultHtml.includes("Vehicle is Compliant") ||
        resultHtml.includes("Compliance Status: Compliant") ||
        resultHtml.includes("Status: Compliant")) {
      Logger.log(`VIN ${vin} is COMPLIANT`);
      return "Y";
    }

    if (resultHtml.includes("Vehicle is Non-Compliant") ||
        resultHtml.includes("Compliance Status: Non-Compliant") ||
        resultHtml.includes("Status: Non-Compliant") ||
        resultHtml.includes("Not Compliant")) {
      Logger.log(`VIN ${vin} is NON-COMPLIANT`);
      return "N";
    }

    // Check if VIN was not found
    if (resultHtml.includes("not found") ||
        resultHtml.includes("No records") ||
        resultHtml.includes("could not be found")) {
      Logger.log(`VIN ${vin} not found in CARB database`);
      return "Not Found";
    }

    // Could not determine status from response
    Logger.log(`WARNING: Could not parse compliance status for VIN ${vin}. Response length: ${resultHtml.length} chars`);
    Logger.log(`Response snippet: ${resultHtml.substring(0, 500)}`);
    return "Error: Parse failed";

  } catch (err) {
    // Catch-all for any unexpected errors
    Logger.log(`ERROR: Unexpected error checking VIN ${vin}: ${err.message}`);
    Logger.log(`Error stack: ${err.stack}`);
    return "Error: " + err.message.substring(0, 30);
  }
}


/**
 * Helper function to manually test a single VIN
 * Useful for debugging and testing without processing the entire sheet
 *
 * Usage: testSingleVIN("1HGBH41JXMN109186")
 */
function testSingleVIN(vin) {
  if (!vin || vin.length !== 17) {
    Logger.log("ERROR: Please provide a valid 17-character VIN");
    return;
  }

  Logger.log(`Testing VIN: ${vin}`);
  const result = checkVINonCARB(vin);
  Logger.log(`Result: ${result}`);

  SpreadsheetApp.getUi().alert(`VIN: ${vin}\nResult: ${result}`);
}


/**
 * Creates a custom menu in Google Sheets
 * Appears when the spreadsheet is opened
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('CARB VIN Checker')
    .addItem('Check All VINs', 'checkAllVINs')
    .addSeparator()
    .addItem('Test Single VIN', 'showTestDialog')
    .addToUi();
}


/**
 * Shows a dialog to test a single VIN
 */
function showTestDialog() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Test Single VIN',
    'Enter a 17-character VIN to test:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const vin = response.getResponseText().trim().toUpperCase();
    testSingleVIN(vin);
  }
}
