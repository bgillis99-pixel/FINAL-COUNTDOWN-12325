# CLAUDE.md - AI Assistant Guide for CARB Clean Truck VIN Check

**Project:** CARB Clean Truck VIN Check (FINAL-COUNTDOWN-12325)
**Type:** Progressive Web App (PWA) - Static HTML5 Application
**Domain:** https://carbcleantruckcheck.app
**Last Updated:** 2025-12-08

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Key Components](#key-components)
5. [Development Workflows](#development-workflows)
6. [Code Conventions](#code-conventions)
7. [Testing & Deployment](#testing--deployment)
8. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

### Purpose
A mobile-first Progressive Web App for validating Vehicle Identification Numbers (VINs) and checking California Air Resources Board (CARB) clean truck compliance. Includes ZIP code-based tester locator with intelligent phone routing.

### Technology Stack
- **Frontend:** Pure vanilla JavaScript (ES6+), HTML5, CSS3
- **Build System:** None - static files only
- **Framework:** None - no external dependencies
- **Deployment:** Vercel with custom domain
- **PWA Features:** Service Worker, Web App Manifest, offline support

### Key Features
- ✅ VIN validation (17-character format with specific rules)
- ✅ ZIP-based tester locator with county mapping
- ✅ Phone routing based on geographic regions in California
- ✅ Progressive Web App installation (iOS/Android)
- ✅ Service Worker for offline caching
- ✅ Tesla-style minimalist UI (navy/white/red color scheme)
- ✅ WCAG 2.1 accessibility compliance

---

## Codebase Structure

### Directory Layout

```
/home/user/FINAL-COUNTDOWN-12325/
├── Core Application Files
│   ├── index.html              (144 lines) - Main PWA entry point
│   ├── app.js                  (160 lines) - Core application logic
│   ├── styles.css              (312 lines) - Complete styling with CSS variables
│   └── sw.js                   (76 lines)  - Service Worker for PWA
│
├── PWA Configuration
│   ├── manifest.json           - PWA manifest (installability)
│   └── manifest.webmanifest    - Duplicate manifest file
│
├── Deployment & SEO
│   ├── vercel.json             - Vercel configuration + security headers
│   ├── robots.txt              - SEO crawler instructions
│   └── sitemap.xml             - SEO sitemap
│
├── Documentation
│   ├── README.md               (450+ lines) - Project documentation
│   ├── DEPLOYMENT.md           (138 lines) - Vercel deployment guide
│   ├── ICON-GENERATION.md      (70 lines)  - Icon asset generation
│   └── CLAUDE.md               - This file
│
├── Assets & Icons
│   ├── assets/
│   │   ├── logo-red.svg        - Red CARB apple logo (SVG)
│   │   └── README-LOGO.md      - Logo specifications
│   │
│   ├── icons/
│   │   ├── arb-192.png         - ARB icon 192x192
│   │   ├── arb-32.png          - ARB icon favicon 32x32
│   │   ├── arb-512.png         - ARB icon 512x512
│   │   ├── arb-logo-red.png    - Red ARB logo (in-app header)
│   │   └── UI ChatGPT blue 12.3.25 - Design reference screenshot
│   │
│   └── Root Icon Files
│       ├── icon.svg            - Main red apple icon
│       ├── icon-192.png        - Apple touch icon variant
│       ├── icon-512.png        - Large icon variant
│       ├── apple-touch-icon.png - iOS home screen icon (180x180)
│       └── logo.svg            - CARB truck check logo (blue)
│
└── Version Control
    ├── .git/                   - Git repository
    └── .gitignore              - Git ignore rules
```

### File Size & Performance
- **Total Repository:** 5.6MB (mostly design reference images)
- **CSS Size:** 5.5KB (styles.css)
- **JavaScript Size:** 5.0KB (app.js)
- **Zero external dependencies:** Fast load times, reduced attack surface

---

## Architecture & Design Patterns

### Application Architecture

**Type:** Single Page Application (SPA) with static HTML
**Pattern:** Event-driven, DOM-centric
**State Management:** None (stateless, no localStorage currently used)

### JavaScript Patterns

#### 1. Event-Driven Architecture
```javascript
// DOMContentLoaded for initialization
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM references
  const vinInput = document.getElementById('vin-input');

  // Attach event listeners
  vinInput.addEventListener('input', handleVinInput);
});
```

#### 2. Data Structure Patterns
- **Sets for Efficient Lookup:** County membership checks
- **Objects for Configuration:** Phone numbers, constants
- **String Trimming:** Validation before operations

```javascript
// Example: Sets for county lookup
const COASTAL_COUNTIES = new Set([
  'Monterey', 'San Luis Obispo', 'Santa Barbara', ...
]);
```

#### 3. Error Handling
```javascript
// Try-catch blocks for async operations
try {
  const county = await lookupCountyByZip(zip);
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Display user-friendly error message
}
```

#### 4. Phone Routing Logic
Three geographic regions with dedicated phone numbers:
- **PHONE_DEFAULT:** "617-359-6953" (fallback)
- **PHONE_INLAND_NORTH:** "916-890-4427" (Sacramento area, 28 counties)
- **PHONE_COAST:** "415-900-8563" (Bay Area, 11 counties)

Function: `getPhoneForCounty(countyName)` routes based on county sets.

### CSS Architecture

#### CSS Custom Properties (Design Tokens)
```css
:root {
  --color-navy: #002b5c;       /* Primary */
  --color-navy-dark: #001a3d;  /* Dark shade */
  --color-red: #b22234;        /* Accent/error */
  --color-bg: #ffffff;         /* Background */
  --color-text: #111111;       /* Text */
}
```

#### Component-Based Structure
- **Base/Reset:** Box-sizing, margin/padding resets
- **Typography:** System font stack with fallbacks
- **Components:** `.btn`, `.form-group`, `.app-card`, etc.
- **Modular, reusable CSS:** Easy to extend

#### Responsive Design Pattern
```css
/* Mobile-first baseline (< 768px) */
.app-card {
  padding: 24px 16px;
}

/* Tablet/Desktop enhancements (>= 768px) */
@media (min-width: 768px) {
  .app-card {
    max-width: 480px;
    padding: 32px;
  }
}
```

### Service Worker Architecture

**Cache Strategy:** Cache-first with network fallback
**Cache Name:** `carb-vin-check-v1`

**Lifecycle:**
1. **Install:** Pre-cache critical assets (index.html, styles.css, app.js, icons)
2. **Fetch:** Attempt cache match → fallback to network → cache successful responses
3. **Activate:** Clean up old cache versions

**Security Measures:**
- Response validation before caching (status 200, type 'basic')
- Prevents caching of failed responses
- Clone response to avoid consuming stream

---

## Key Components

### 1. index.html (144 lines)

**Structure:**
```html
<header class="app-header">
  <img src="icons/arb-logo-red.png" alt="CARB Logo">
  <h1>Clean Truck VIN Check</h1>
</header>

<main>
  <div class="app-card">
    <!-- VIN Section -->
    <section>
      <button id="scan-vin-btn">Scan VIN</button>
      <input id="vin-input" maxlength="17" autocomplete="off">
      <button id="check-compliance-btn">Check Compliance</button>
    </section>

    <!-- Tester Locator Section -->
    <section>
      <input id="tester-zip-input" maxlength="5" inputmode="numeric">
      <button id="find-tester-zip-btn">Find a Tester</button>
      <div id="tester-result" hidden>
        <!-- Dynamic tester information -->
      </div>
    </section>
  </div>
</main>
```

**Key Attributes:**
- `maxlength="17"` on VIN input (enforce length limit)
- `maxlength="5"` on ZIP input (5-digit ZIP)
- `inputmode="numeric"` on ZIP (mobile keyboard optimization)
- `autocomplete="off"` on VIN (sensitive data)
- `hidden` attribute for conditional display

### 2. app.js (160 lines)

**Core Functions:**

#### `getPhoneForCounty(countyName)`
Routes phone number based on county membership in three sets:
- Returns PHONE_COAST for coastal counties
- Returns PHONE_INLAND_NORTH for inland north counties
- Returns PHONE_DEFAULT for all others

#### `lookupCountyByZip(zip)`
**Current Status:** Placeholder stub (always returns "Sacramento")
**TODO:** Replace with real ZIP-to-county mapping (JSON map or API)

```javascript
function lookupCountyByZip(zip) {
  // TODO: Replace with real ZIP to county lookup
  // This could be a JSON map or API call
  return "Sacramento"; // Placeholder
}
```

#### `handleFindTesterZip()`
Main ZIP submission handler:
1. Validates ZIP format (5 digits)
2. Looks up county by ZIP
3. Determines phone number based on county
4. Displays tester information
5. Updates call button with tel: link

**DOM Element References:**
```javascript
const vinInput = document.getElementById('vin-input');
const checkBtn = document.getElementById('check-compliance-btn');
const scanBtn = document.getElementById('scan-vin-btn');
const zipInput = document.getElementById('tester-zip-input');
const findTesterBtn = document.getElementById('find-tester-zip-btn');
const testerResult = document.getElementById('tester-result');
```

### 3. styles.css (312 lines)

**Color Palette:**
- **Primary (Navy):** `#002b5c` - Buttons, headings, borders
- **White:** `#ffffff` - Card background, button text
- **Red:** `#b22234` - Logo, error states, accent color
- **Grays:** `#f5f5f5`, `#e0e0e0`, `#757575` - Backgrounds and text

**Button System:**
```css
/* Primary Button */
.btn-primary {
  height: 56px;
  background: var(--color-navy);
  color: white;
  border-radius: 14px;
  transition: all 120ms ease-out;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background: #e0e0e0;
  color: #757575;
}
```

**Form Elements:**
```css
.field-input {
  height: 56px;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  font-size: 16px;
}

.field-input:focus {
  border-color: var(--color-navy);
  box-shadow: 0 0 0 3px rgba(0, 43, 92, 0.1);
}
```

### 4. sw.js (76 lines)

**Install Event:**
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png'
      ]);
    })
  );
  self.skipWaiting();
});
```

**Fetch Event:**
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) return response;

      // Clone request and fetch from network
      return fetch(event.request.clone()).then((response) => {
        // Validate response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache successful response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
```

---

## Development Workflows

### Local Development Setup

The project supports multiple local development servers (choose one):

#### Python (built-in, recommended)
```bash
cd /home/user/FINAL-COUNTDOWN-12325

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Node.js
```bash
# Using npx (no installation required)
npx serve

# Or with http-server
npx http-server -p 8000
```

#### PHP
```bash
php -S localhost:8000
```

#### VS Code
Install "Live Server" extension → Right-click `index.html` → "Open with Live Server"

**Access:** Open browser to `http://localhost:8000`

### Git Workflow

**Current Branch:** `claude/claude-md-miwrfmds8bh4e919-01Hk81fpQKpCFhJrHaZKnxmq`

**Branch Naming Convention:**
- Feature branches: `claude/<description>-<session-id>`
- IMPORTANT: Branch must start with `claude/` and end with session ID for push to succeed

**Commit Message Convention:**
```bash
# Conventional Commits format
feat: add new feature
fix: bug fix
refactor: code restructuring
docs: documentation updates
style: formatting changes
test: test additions
chore: maintenance tasks
```

**Example Workflow:**
```bash
# Check current status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add ZIP-based tester lookup and phone routing"

# Push to remote (use -u flag for new branches)
git push -u origin claude/claude-md-miwrfmds8bh4e919-01Hk81fpQKpCFhJrHaZKnxmq
```

**Network Error Handling:**
If push fails due to network errors, retry up to 4 times with exponential backoff:
- Wait 2s → retry → wait 4s → retry → wait 8s → retry → wait 16s

### Deployment to Vercel

**Automatic Deployment:**
- Push to branch → Vercel auto-deploys
- No build step required (static files)

**Manual Deployment:**
```bash
# Install Vercel CLI (if needed)
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**DNS Configuration:**
See DEPLOYMENT.md for complete DNS setup instructions.

**Deployment Verification:**
1. Check Vercel dashboard for green checkmark
2. Visit https://carbcleantruckcheck.app
3. Test PWA installation on mobile device
4. Verify service worker registration in DevTools

### Testing PWA Locally

**Service Worker Testing:**
1. Must use HTTPS or localhost (HTTP won't work)
2. Open DevTools → Application tab → Service Workers
3. Verify "activated and running" status
4. Test offline mode: Check "Offline" → reload page

**PWA Installation Testing:**
- **Android (Chrome):** Menu (⋮) → "Install app"
- **iOS (Safari):** Share button → "Add to Home Screen"
- **Desktop (Chrome/Edge):** Install icon in address bar

---

## Code Conventions

### JavaScript Conventions

#### 1. Variable Naming
```javascript
// Use descriptive, camelCase names
const testerCountyLine = document.getElementById('tester-county');
const phoneNumber = getPhoneForCounty(county);

// Constants in UPPER_SNAKE_CASE
const PHONE_DEFAULT = "617-359-6953";
const CACHE_NAME = 'carb-vin-check-v1';
```

#### 2. Function Naming
```javascript
// Verb-first, descriptive names
function handleFindTesterZip() { }
function lookupCountyByZip(zip) { }
function getPhoneForCounty(countyName) { }
```

#### 3. DOM Manipulation
```javascript
// Cache DOM references (don't query repeatedly)
const vinInput = document.getElementById('vin-input');
const checkBtn = document.getElementById('check-compliance-btn');

// Use textContent for text, innerHTML only when needed
element.textContent = 'New text content';

// Use hidden attribute for show/hide
element.hidden = true;  // Hide
element.hidden = false; // Show
```

#### 4. String Manipulation
```javascript
// Use template literals for interpolation
const message = `County: ${countyName}`;

// Trim inputs before validation
const zip = zipInput.value.trim();

// Use regex for validation
const isValidZip = /^[0-9]{5}$/.test(zip);
```

#### 5. Error Handling
```javascript
// Always use try-catch for async operations
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Display user-friendly message to DOM
  errorElement.textContent = 'An error occurred. Please try again.';
}
```

#### 6. Event Listeners
```javascript
// Always wait for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize app
  const button = document.getElementById('my-button');
  button.addEventListener('click', handleClick);
});
```

### CSS Conventions

#### 1. Class Naming
```css
/* Component-based naming (BEM-like) */
.app-header { }
.app-card { }
.btn { }
.btn-primary { }
.btn-secondary { }
.form-group { }
.field-label { }
.field-input { }
```

#### 2. Use CSS Custom Properties
```css
/* Define tokens at :root */
:root {
  --color-navy: #002b5c;
  --spacing-sm: 8px;
  --spacing-md: 16px;
}

/* Reference throughout */
.button {
  background: var(--color-navy);
  padding: var(--spacing-md);
}
```

#### 3. Mobile-First Media Queries
```css
/* Default styles for mobile */
.element {
  font-size: 14px;
}

/* Enhancements for larger screens */
@media (min-width: 768px) {
  .element {
    font-size: 16px;
  }
}
```

#### 4. Accessibility
```css
/* Always include focus states */
.button:focus {
  outline: 2px solid var(--color-navy);
  outline-offset: 2px;
}

/* Sufficient contrast ratios (WCAG AA) */
.text {
  color: #111111; /* High contrast on white */
}
```

### HTML Conventions

#### 1. Semantic Structure
```html
<header class="app-header">...</header>
<main>
  <section>...</section>
</main>
<footer class="app-footer">...</footer>
```

#### 2. Form Accessibility
```html
<!-- Always associate labels with inputs -->
<label for="vin-input">Vehicle Identification Number (VIN)</label>
<input id="vin-input" type="text" name="vin" />

<!-- Use descriptive button text (not just icons) -->
<button type="button">Check Compliance</button>
```

#### 3. Input Attributes
```html
<!-- Use maxlength for character limits -->
<input maxlength="17" />

<!-- Use inputmode for mobile keyboards -->
<input inputmode="numeric" /> <!-- Shows number pad on mobile -->

<!-- Use autocomplete appropriately -->
<input autocomplete="off" /> <!-- For sensitive data -->
<input autocomplete="postal-code" /> <!-- For ZIP codes -->
```

---

## Testing & Deployment

### Browser Support

**Supported Browsers:**
- ✅ Chrome/Edge 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Not Supported:**
- ❌ Internet Explorer (any version)
- ❌ Opera Mini (limited PWA support)

### Testing Checklist

#### Functional Testing
- [ ] VIN input validation (17 characters)
- [ ] ZIP input validation (5 digits, numeric only)
- [ ] Phone routing logic (correct number for each county)
- [ ] Tester result display and hiding
- [ ] Call button tel: link functionality

#### Responsive Testing
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Portrait and landscape orientations

#### PWA Testing
- [ ] Service worker registration
- [ ] Offline functionality (cached assets load)
- [ ] Install to home screen (Android)
- [ ] Install to home screen (iOS)
- [ ] Standalone mode display
- [ ] Icon display correct

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text
- [ ] Form labels properly associated

#### Performance Testing
- [ ] Page load time < 2 seconds
- [ ] No console errors
- [ ] Service worker caches correctly
- [ ] CSS and JS file sizes reasonable

### Deployment Process

**Vercel Automatic Deployment:**
1. Commit changes to git
2. Push to branch
3. Vercel automatically detects push
4. Deploys to preview URL
5. After merge to main: deploys to production

**Manual Verification Steps:**
1. Visit deployed URL
2. Open DevTools → Console (check for errors)
3. Open DevTools → Application → Service Workers (verify registration)
4. Test primary user flows (VIN check, tester lookup)
5. Test PWA installation on mobile device

**Rollback Procedure:**
If deployment has issues, use Vercel dashboard to rollback to previous deployment.

---

## Important Notes for AI Assistants

### Current Implementation Status

#### ✅ Completed Features
- VIN input with character limit and validation
- ZIP input with numeric keyboard on mobile
- Phone routing logic with 3 geographic regions
- County-based phone number selection
- Tester result display UI
- Responsive design (mobile-first)
- Service Worker for offline support
- PWA manifest for installability
- Security headers (Vercel configuration)

#### 🚧 Incomplete Features (TODOs)

**High Priority:**
1. **ZIP to County Mapping** (`app.js:lookupCountyByZip()`)
   - Current: Returns hardcoded "Sacramento"
   - Needed: Real ZIP-to-county lookup (JSON map or API)
   - Location: `app.js` line ~120

2. **VIN Validation Logic**
   - Current: Input limited to 17 chars, but no format validation
   - Needed: Validate VIN format (alphanumeric, no I/O/Q, last 6 numeric)
   - Mentioned in README but not implemented in `app.js`

**Medium Priority:**
3. **Camera VIN Scanning**
   - Current: Placeholder button (no functionality)
   - Needed: Integrate camera API + OCR (QuaggaJS or Tesseract.js)

4. **Actual CARB API Integration**
   - Current: Mock data
   - Needed: Real compliance check API

5. **Tester Database Integration**
   - Current: Phone numbers hardcoded
   - Needed: Real tester database with locations, ratings, etc.

**Low Priority (Roadmap):**
- Spanish language support
- Dark mode toggle
- VIN barcode scanner
- Unit tests (Jest)
- Analytics integration

### Common Tasks & How to Approach Them

#### Task: Add Real ZIP-to-County Mapping

**Option 1: JSON Map (Static)**
1. Create `data/zip-county-map.json` with ZIP → county mappings
2. Fetch JSON in `app.js` on DOMContentLoaded
3. Update `lookupCountyByZip()` to query the map

```javascript
// Example implementation
let zipCountyMap = {};

async function loadZipCountyMap() {
  const response = await fetch('/data/zip-county-map.json');
  zipCountyMap = await response.json();
}

function lookupCountyByZip(zip) {
  return zipCountyMap[zip] || 'Unknown';
}
```

**Option 2: API Call (Dynamic)**
1. Replace stub with fetch to external API
2. Add error handling for network failures
3. Consider caching results in localStorage

#### Task: Implement VIN Validation

**Requirements:**
- Exactly 17 characters
- Alphanumeric only (A-Z, 0-9)
- Exclude letters I, O, Q
- Last 6 characters must be numeric
- Pattern: `^[A-HJ-NPR-Z0-9]{17}$`

**Implementation:**
```javascript
function isValidVIN(vin) {
  if (!vin || vin.length !== 17) return false;

  // Check format (no I, O, Q)
  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinPattern.test(vin)) return false;

  // Check last 6 are numeric
  const lastSix = vin.slice(-6);
  return /^\d{6}$/.test(lastSix);
}
```

**Integration:**
Add event listener to VIN input for real-time validation:
```javascript
vinInput.addEventListener('input', () => {
  const vin = vinInput.value.toUpperCase().replace(/\s/g, '');
  vinInput.value = vin;

  const isValid = isValidVIN(vin);
  checkBtn.disabled = !isValid;

  // Update UI with validation feedback
  if (vin.length === 17 && !isValid) {
    // Show error message
  }
});
```

#### Task: Add New UI Component

**Steps:**
1. Add HTML structure in `index.html`
2. Add styles in `styles.css` following existing patterns
3. Add JavaScript functionality in `app.js`
4. Cache DOM references in DOMContentLoaded
5. Attach event listeners
6. Test responsive design at all breakpoints

**Example: Add Language Toggle**
```html
<!-- index.html -->
<button id="lang-toggle" class="btn btn-secondary">
  <span id="lang-text">Español</span>
</button>
```

```css
/* styles.css */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-navy);
  color: var(--color-navy);
}
```

```javascript
// app.js
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = 'en';

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateLanguage(currentLang);
  });
});
```

### File Modification Guidelines

#### When to Edit Each File

**index.html:**
- Adding new UI elements or sections
- Updating meta tags (PWA, SEO)
- Changing page structure
- Modifying form fields

**app.js:**
- Adding new functionality or features
- Updating validation logic
- Implementing API integrations
- Adding event handlers

**styles.css:**
- Updating design or styling
- Adding new components
- Modifying responsive breakpoints
- Changing color scheme (use CSS variables!)

**sw.js:**
- Updating cache strategy
- Adding/removing cached resources
- Changing cache version (increment `CACHE_NAME`)

**manifest.json:**
- Updating PWA metadata (name, icons, colors)
- Changing display mode or orientation

**vercel.json:**
- Adding HTTP headers
- Configuring redirects
- Updating security settings

### Performance Considerations

**Best Practices:**
- Keep JavaScript file size minimal (currently 5KB - maintain this)
- Avoid adding external dependencies unless absolutely necessary
- Compress images before adding to repository
- Use SVG for icons when possible (smaller file size)
- Lazy load non-critical assets
- Minimize DOM queries (cache references)

**Service Worker Cache Management:**
- Update `CACHE_NAME` version when making changes to cached files
- Old cache versions are automatically cleaned up on activate
- Don't cache dynamic API responses (use network-first strategy)

### Security Considerations

**Current Security Headers (vercel.json):**
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

**When Adding New Features:**
- Validate all user inputs (client and server-side)
- Sanitize data before displaying in DOM (prevent XSS)
- Use textContent instead of innerHTML when possible
- Never expose API keys in client-side code
- Use environment variables for sensitive data (Vercel)
- Always use HTTPS for external API calls

### Accessibility Guidelines

**Always Include:**
- Proper `<label>` for all form inputs
- `alt` text for all images
- ARIA attributes when needed (aria-hidden, aria-label)
- Keyboard navigation support
- Visible focus states
- Sufficient color contrast (WCAG AA minimum)

**Test With:**
- Keyboard only navigation (Tab, Enter, Space)
- Screen reader (NVDA, JAWS, VoiceOver)
- Color contrast checker tools
- Lighthouse accessibility audit

### Git Best Practices

**Before Committing:**
1. Test changes locally
2. Check console for errors
3. Verify responsive design
4. Run Lighthouse audit if available
5. Review git diff to ensure no unintended changes

**Commit Message Examples:**
```bash
# Good commit messages
git commit -m "feat: add real ZIP-to-county mapping using JSON data"
git commit -m "fix: correct phone routing for coastal counties"
git commit -m "refactor: extract VIN validation to separate function"
git commit -m "docs: update README with new API integration steps"

# Bad commit messages (avoid)
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

**Push Best Practices:**
```bash
# Always use -u flag for new branches
git push -u origin claude/claude-md-miwrfmds8bh4e919-01Hk81fpQKpCFhJrHaZKnxmq

# For existing tracked branches
git push

# If network fails, retry with exponential backoff (see Development Workflows)
```

### When to Ask for User Clarification

**Always Ask When:**
- Adding external dependencies (libraries, frameworks)
- Making breaking changes to existing functionality
- Changing color scheme or major design elements
- Implementing features not in the TODO list
- Integrating third-party APIs or services
- Modifying deployment configuration

**Safe to Proceed Without Asking:**
- Fixing obvious bugs
- Implementing features from the README TODO list
- Refactoring code for better readability
- Adding code comments or documentation
- Updating dependencies (patch versions only)
- Improving accessibility

---

## Quick Reference

### Essential File Paths
```
Main App:        /home/user/FINAL-COUNTDOWN-12325/index.html
JavaScript:      /home/user/FINAL-COUNTDOWN-12325/app.js
Styles:          /home/user/FINAL-COUNTDOWN-12325/styles.css
Service Worker:  /home/user/FINAL-COUNTDOWN-12325/sw.js
Manifest:        /home/user/FINAL-COUNTDOWN-12325/manifest.json
Vercel Config:   /home/user/FINAL-COUNTDOWN-12325/vercel.json
```

### Color Variables (CSS)
```css
--color-navy:       #002b5c  /* Primary buttons, headings, borders */
--color-navy-dark:  #001a3d  /* Dark navy variant */
--color-red:        #b22234  /* Logo, errors, accents */
--color-bg:         #ffffff  /* Background */
--color-text:       #111111  /* Text */
```

### Phone Numbers by Region
```javascript
PHONE_DEFAULT:      "617-359-6953"  // Fallback
PHONE_INLAND_NORTH: "916-890-4427"  // Sacramento area (28 counties)
PHONE_COAST:        "415-900-8563"  // Bay Area (11 counties)
```

### Responsive Breakpoints
```css
Mobile:  < 768px   (default)
Tablet:  >= 768px  (centered card, max-width: 480px)
Desktop: >= 1024px (hover effects)
```

### Domain & Deployment
```
Production URL: https://carbcleantruckcheck.app
Hosting:        Vercel
Branch:         claude/claude-md-miwrfmds8bh4e919-01Hk81fpQKpCFhJrHaZKnxmq
```

---

## Summary

This CARB Clean Truck VIN Check application is a **lightweight, mobile-first Progressive Web App** built with pure vanilla JavaScript. It prioritizes **accessibility**, **performance**, and **user experience** with a Tesla-style minimalist design.

**Key Principles:**
1. **No external dependencies** - Keep it simple and fast
2. **Mobile-first** - Design for small screens, enhance for large
3. **Accessibility** - WCAG 2.1 compliant, keyboard navigable
4. **Progressive enhancement** - Core functionality works everywhere, PWA features enhance where supported
5. **Convention over configuration** - Follow established patterns in the codebase

**When in Doubt:**
- Check existing code patterns in `app.js`, `styles.css`, and `index.html`
- Refer to this CLAUDE.md for conventions
- Ask the user for clarification on major changes
- Test thoroughly before committing

---

**Last Updated:** 2025-12-08
**Maintained by:** AI Assistants working with bgillis99-pixel
**Repository:** https://github.com/bgillis99-pixel/FINAL-COUNTDOWN-12325
