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
