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