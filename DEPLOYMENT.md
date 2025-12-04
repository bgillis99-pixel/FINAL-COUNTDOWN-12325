# CARB Clean Truck VIN Check - Deployment Guide

## Vercel Deployment Instructions

### Step 1: Generate Icon Assets (One-time setup)

Before deploying, you need to generate PNG icons from the SVG source:

**Quick method using ImageMagick:**
```bash
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
convert icon.svg -resize 180x180 apple-touch-icon.png
```

See `ICON-GENERATION.md` for alternative methods if ImageMagick is not available.

### Step 2: Create Vercel Project (One-time setup)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Add New** → **Project**
3. Import repository: `bgillis99-pixel/FINAL-COUNTDOWN-12325`
4. Configure project settings:
   - **Framework Preset**: Other / Static
   - **Build Command**: (leave empty)
   - **Output Directory**: `.` (root directory)
   - **Install Command**: (leave empty)
5. Click **Deploy**

### Step 3: Configure Custom Domain

1. In Vercel project dashboard, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `carbcleantruckcheck.app`
4. Vercel will provide DNS configuration instructions

### Step 4: Update DNS Records at Domain Registrar

Add the following DNS records at your domain registrar (where you purchased carbcleantruckcheck.app):

**For root domain (carbcleantruckcheck.app):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Wait for DNS propagation** (can take up to 48 hours, usually much faster)

### Step 5: Verify SSL Certificate

Once DNS propagates:
1. Vercel will automatically provision SSL certificate
2. Check for green checkmark next to domain in Vercel dashboard
3. Visit `https://carbcleantruckcheck.app` to verify

### Step 6: Test PWA Installation

#### Android (Chrome):
1. Open `https://carbcleantruckcheck.app` in Chrome
2. Tap the menu (⋮) → **Install app** or **Add to Home Screen**
3. Confirm installation
4. App icon with red apple logo should appear on home screen
5. Tap to open as standalone app

#### iOS (Safari):
1. Open `https://carbcleantruckcheck.app` in Safari
2. Tap the Share button (□↑)
3. Scroll and tap **Add to Home Screen**
4. Edit name if desired (defaults to "CARB VIN")
5. Tap **Add**
6. App icon should appear on home screen

## Project Structure

```
FINAL-COUNTDOWN-12325/
├── index.html              # Main PWA application
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker for offline support
├── icon.svg                # Source icon (SVG)
├── icon-192.png            # PWA icon 192x192
├── icon-512.png            # PWA icon 512x512
├── apple-touch-icon.png    # iOS icon 180x180
├── vercel.json             # Vercel configuration
├── DEPLOYMENT.md           # This file
└── ICON-GENERATION.md      # Icon generation instructions
```

## Features

✅ Progressive Web App (PWA) with offline support
✅ Install to home screen (Android & iOS)
✅ Custom red apple branding
✅ VIN validation (17 characters, format check)
✅ Responsive design
✅ Service Worker caching
✅ SSL/HTTPS enabled
✅ Custom domain support

## Updating the App

To update the deployed app:

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push origin claude/setup-vercel-deployment-01RZBz7pGfJP2uPYLFNko77e
```

Vercel will automatically detect the push and redeploy.

## Troubleshooting

### Icons not showing:
- Verify PNG files are committed to repository
- Check file names match manifest.json and index.html
- Clear browser cache and reinstall PWA

### Domain not working:
- Verify DNS records are correct
- Wait for DNS propagation (check with `dig carbcleantruckcheck.app`)
- Check Vercel dashboard for SSL certificate status

### PWA not installable:
- Verify manifest.json is accessible at `/manifest.json`
- Check browser console for errors
- Ensure HTTPS is enabled (required for PWA)
- Verify service worker registered successfully

## Support

For Vercel-specific issues, see: https://vercel.com/docs
For PWA requirements, see: https://web.dev/progressive-web-apps/
