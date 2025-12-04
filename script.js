// Default target date (New Year 2026)
let targetDate = new Date('2026-01-01T00:00:00').getTime();

// Load saved date from localStorage if available
const savedDate = localStorage.getItem('countdownTarget');
if (savedDate) {
    targetDate = parseInt(savedDate);
}

// Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const targetDisplay = document.getElementById('target-display');
const datePicker = document.getElementById('date-picker');
const setDateBtn = document.getElementById('set-date');

// Format number to always show two digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Update countdown display
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
}

// Update target date display
function updateTargetDisplay() {
    const date = new Date(targetDate);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    targetDisplay.textContent = date.toLocaleDateString('en-US', options);
}

// Set up date picker with current target
function initializeDatePicker() {
    const date = new Date(targetDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    datePicker.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Handle date change
setDateBtn.addEventListener('click', () => {
    const newDate = new Date(datePicker.value).getTime();

    if (isNaN(newDate)) {
        alert('Please select a valid date and time');
        return;
    }

    if (newDate <= new Date().getTime()) {
        alert('Please select a future date and time');
        return;
    }

    targetDate = newDate;
    localStorage.setItem('countdownTarget', targetDate);
    updateTargetDisplay();
    updateCountdown();
});

// Initialize
initializeDatePicker();
updateTargetDisplay();
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);
