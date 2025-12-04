# CARB Clean Truck Check – VIN Lookup UI

A simple, Tesla-style VIN lookup interface for **carbcleantruckcheck.app** – a mobile-first Progressive Web App (PWA) for checking California Air Resources Board (CARB) clean truck compliance.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Mobile First](https://img.shields.io/badge/mobile-first-green.svg)
![PWA Ready](https://img.shields.io/badge/PWA-ready-orange.svg)

---

## 🚀 Features

- **📱 Mobile-First Design** – Optimized for smartphones and tablets
- **🎨 Tesla-Style UI** – Clean, minimalist interface with navy/white/red color scheme
- **✅ Real-Time VIN Validation** – Instant feedback as users type
- **🔍 VIN Lookup** – Check vehicle compliance status (mock data for demo)
- **📲 PWA Support** – Install as a standalone app on iOS/Android
- **⚡ Lightning Fast** – Pure vanilla JavaScript, no frameworks
- **♿ Accessible** – WCAG 2.1 compliant design

---

## 📁 File Structure

```
FINAL-COUNTDOWN-12325/
├── index.html          # Main HTML file with PWA meta tags
├── styles.css          # Mobile-first CSS with navy/white/red theme
├── app.js              # VIN validation and lookup logic
├── manifest.json       # PWA manifest for "Add to Home Screen"
├── assets/
│   ├── logo-red.png    # Red apple CARB logo (add your own)
│   └── README-LOGO.md  # Instructions for logo asset
└── README.md           # This file
```

---

## 🎨 Design Specifications

### Color Palette
- **Primary (Navy)**: `#001f3f` – Buttons, headings, borders
- **White**: `#ffffff` – Card background, button text
- **Red**: `#d32f2f` – Logo, error states, accent color
- **Grays**: `#f5f5f5`, `#e0e0e0`, `#757575` – Backgrounds and text

### Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- **Headings**: 600 weight, navy color
- **Body**: 400 weight, responsive sizing

### Responsive Breakpoints
- **Mobile**: `< 768px` (default)
- **Tablet**: `>= 768px` (centered card, larger text)
- **Desktop**: `>= 1024px` (hover effects, max-width card)

---

## 🛠️ VIN Validation

The app validates VINs according to standard rules:

- **Length**: Exactly 17 characters
- **Characters**: Alphanumeric only (A-Z, 0-9)
- **Exclusions**: Letters `I`, `O`, and `Q` are not allowed in VINs
- **Format**: Must match pattern `^[A-HJ-NPR-Z0-9]{17}$`

### Real-Time Feedback
- Character count as user types
- Invalid character warnings
- Success indicator when VIN is valid
- Auto-uppercase conversion

---

## 📲 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the **Share** button
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** to confirm

### Android (Chrome)
1. Open the app in Chrome
2. Tap the **⋮** menu button
3. Tap **Add to Home Screen**
4. Tap **Add** to confirm

### Desktop (Chrome/Edge)
1. Click the **⊕** install icon in the address bar
2. Click **Install** to confirm

---

## 🚀 Deployment

### Vercel (Recommended)
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Production Deploy**:
   ```bash
   vercel --prod
   ```

### GitHub Pages
1. Push to GitHub repository
2. Go to **Settings → Pages**
3. Select branch and `/root` folder
4. Save and wait for deployment

### Netlify
1. Drag and drop the folder on [netlify.com/drop](https://app.netlify.com/drop)
2. Or connect your Git repository for automatic deployments

---

## 🧪 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/FINAL-COUNTDOWN-12325.git
   cd FINAL-COUNTDOWN-12325
   ```

2. **Add the logo**:
   - Place your red CARB logo as `assets/logo-red.png`
   - See `assets/README-LOGO.md` for specifications

3. **Start a local server**:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (with npx)
   npx serve

   # PHP
   php -S localhost:8000
   ```

4. **Open in browser**:
   ```
   http://localhost:8000
   ```

---

## 🔌 API Integration

Currently, the app uses **mock data** for demonstration. To connect to a real CARB API:

1. **Update `app.js`** – Replace the `lookupVIN()` function:
   ```javascript
   async function lookupVIN(vin) {
       const response = await fetch(`https://api.carbcleantruckcheck.app/vin/${vin}`, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer YOUR_API_KEY'
           }
       });

       if (!response.ok) {
           throw new Error('Vehicle not found');
       }

       return await response.json();
   }
   ```

2. **Add environment variables** (for API keys):
   - Consider using Vercel Environment Variables or a `.env` file
   - Never commit API keys to version control

---

## 🎯 Browser Support

- ✅ **Chrome/Edge** (latest 2 versions)
- ✅ **Safari** (iOS 12+, macOS latest)
- ✅ **Firefox** (latest 2 versions)
- ✅ **Samsung Internet** (latest)

---

## 📝 To-Do / Roadmap

- [ ] Add real CARB API integration
- [ ] Implement service worker for offline support
- [ ] Add VIN barcode scanner (camera API)
- [ ] Create 192x192 and 512x512 icon versions
- [ ] Add unit tests (Jest)
- [ ] Implement analytics (privacy-focused)
- [ ] Add Spanish language support
- [ ] Dark mode toggle

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **California Air Resources Board (CARB)** – For clean air initiatives
- **Tesla Design System** – Inspiration for minimalist UI
- **Community** – For feedback and contributions

---

## 📧 Contact

For questions or support:
- **Website**: [carbcleantruckcheck.app](https://carbcleantruckcheck.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/FINAL-COUNTDOWN-12325/issues)

---

**Built with ❤️ for cleaner California air**
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
# FINAL-COUNTDOWN-12325

A beautiful, customizable countdown timer web application. Perfect for tracking important events, deadlines, or celebrations!

## Features

- **Real-time Countdown**: Live updates showing days, hours, minutes, and seconds
- **Customizable Target Date**: Set any future date and time
- **Persistent Storage**: Your selected date is saved in browser localStorage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Glassmorphism design with smooth animations

## Local Development Setup

### Option 1: Clone and Run

```bash
# Clone the repository
git clone https://github.com/bgillis99-pixel/FINAL-COUNTDOWN-12325.git
cd FINAL-COUNTDOWN-12325

# Start a local server using Python
python -m http.server 3000

# Visit http://localhost:3000 in your browser
```

### Option 2: Direct File Access

Since this is a static site, you can also open `index.html` directly in your web browser:

```bash
# Navigate to the project directory
cd FINAL-COUNTDOWN-12325

# Open in browser (or just double-click index.html)
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Other Server Options

You can use any static file server:

```bash
# Using Node.js http-server (install with: npm install -g http-server)
http-server -p 3000

# Using PHP
php -S localhost:3000

# Using Ruby
ruby -run -ehttpd . -p3000
```

## Usage

1. Open the application in your browser
2. The default countdown is set to New Year 2026
3. To customize:
   - Click on the date/time picker
   - Select your desired target date and time
   - Click "Set Date" to update the countdown
4. Your selection will be saved automatically and persist across browser sessions

## Project Structure

```
FINAL-COUNTDOWN-12325/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Countdown logic and interactivity
└── README.md       # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and glassmorphism
- **Vanilla JavaScript**: No dependencies, pure JS for countdown logic
- **LocalStorage API**: Persistent data storage

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

MIT License - Feel free to use this project for any purpose!
