# CARB Clean Truck Check

A web application for validating Vehicle Identification Numbers (VINs) and checking compliance with California Air Resources Board (CARB) clean truck requirements.

## Features

- **VIN Validation**: Validates 17-character VINs with specific format requirements
- **Real-time Feedback**: Live character count and validation as you type
- **Camera Scanning**: Placeholder for future VIN scanning via camera (coming soon)
- **Compliance Checking**: Check if a vehicle meets CARB clean truck standards
- **Tester Locator**: Find certified CARB testers by ZIP code (coming soon)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with WCAG guidelines in mind

## VIN Requirements

Valid VINs must meet the following criteria:
- Exactly **17 characters** in length
- Last **6 characters must be numeric**
- Automatically converted to uppercase
- Spaces are automatically removed

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Comprehensive styling with CSS variables
├── app.js              # VIN validation and application logic
├── logo.svg            # Application logo
└── README.md           # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: A local web server for testing

### Running Locally

1. **Simple HTTP Server (Python)**:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **Node.js HTTP Server**:
   ```bash
   npx http-server -p 8000
   ```

3. **VS Code Live Server Extension**:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. Open your browser and navigate to:
   - `http://localhost:8000`

## Usage

### Manual VIN Entry

1. Enter a 17-character VIN in the input field
2. The character count updates in real-time
3. The "Check Compliance" button enables when the VIN is valid
4. Click "Check Compliance" to validate the vehicle

### VIN Scanning (Coming Soon)

1. Click the "Scan VIN" button
2. Allow camera access
3. Position your camera to scan the VIN barcode or plate
4. The VIN will be automatically populated

### Finding a Tester

1. Click "Find a Tester"
2. Enter your ZIP code
3. View nearby certified CARB testers

## Technical Details

### VIN Validation Logic

The application validates VINs using the following rules:

```javascript
function isValidVIN(vin) {
  if (!vin || vin.length !== 17) return false;
  const lastSix = vin.slice(-6);
  return /^\d{6}$/.test(lastSix);
}
```

### Input Sanitization

- Converts all input to uppercase
- Removes whitespace characters
- Limits input to 17 characters

### CSS Architecture

The stylesheet uses:
- **CSS Custom Properties** for easy theming
- **Mobile-first responsive design**
- **Accessibility features** (focus states, contrast modes)
- **Modern layout techniques** (Flexbox)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Integrate camera-based VIN scanning (QuaggaJS or Tesseract.js)
- [ ] Connect to actual CARB compliance API
- [ ] Implement real tester location database
- [ ] Add VIN decoding to show vehicle details
- [ ] Offline support with Service Workers
- [ ] Progressive Web App (PWA) capabilities
- [ ] Multi-language support (English/Spanish)
- [ ] Save recent VIN searches
- [ ] Export compliance reports

## API Integration (Future)

### Compliance Check Endpoint

```javascript
POST /api/compliance/check
{
  "vin": "1XPTP4EX5DD181493"
}

Response:
{
  "compliant": true,
  "lastInspection": "2024-01-15",
  "expirationDate": "2025-01-15",
  "vehicleInfo": {
    "year": 2023,
    "make": "Freightliner",
    "model": "Cascadia"
  }
}
```

### Tester Locator Endpoint

```javascript
GET /api/testers?zip=94105&radius=25

Response:
{
  "testers": [
    {
      "name": "Bay Area Truck Testing",
      "address": "123 Main St, San Francisco, CA 94105",
      "phone": "(415) 555-0123",
      "distance": 2.3,
      "rating": 4.8
    }
  ]
}
```

## Development

### Code Style

- Use ES6+ JavaScript features
- Follow semantic HTML practices
- Use BEM-like CSS naming conventions
- Add JSDoc comments for functions
- Maintain accessibility standards

### Testing

To test VIN validation:

```javascript
// Valid VINs (last 6 chars are numeric)
isValidVIN('1XPTP4EX5DD181493') // true
isValidVIN('5FNRL6H78MB123456') // true

// Invalid VINs
isValidVIN('1XPTP4EX5DD18149A') // false (last char is letter)
isValidVIN('SHORT')              // false (too short)
isValidVIN('TOOLONGVINSTRING12') // false (too long)
```

## License

This project is intended for educational and demonstration purposes.

## Contact

For questions about CARB clean truck requirements, visit:
- [CARB Heavy-Duty Program](https://ww2.arb.ca.gov/our-work/programs/heavy-duty-inspection-and-maintenance-program)

---

**Built with ❤️ for cleaner California air**
