// Constants for cash amount key in localStorage
const CASH_AMOUNT_KEY = 'cashAmount';

// Save the cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem(CASH_AMOUNT_KEY, amount);
}

// Load the cash amount from localStorage
function loadCashAmount() {
    return parseInt(localStorage.getItem(CASH_AMOUNT_KEY), 10) || 0;
}

// Function to update the displayed cash amount
function updateCashDisplay(cashAmount) {
    const cashCounter = document.querySelector('#cash-amount');
    if (cashCounter) {
        cashCounter.textContent = `$${cashAmount}`;
    }
}

// Function to animate the cash count-up to the new value over a fixed duration
function animateCashCountUp(startValue, endValue, duration) {
    const cashAmountElement = document.querySelector('#cash-amount');
    if (!cashAmountElement) return; // Ensure the element exists before starting the animation

    let startTime = null; // Initialize the start time

    // The update function is called recursively for smooth animation
    function updateCount(currentTime) {
        if (!startTime) startTime = currentTime; // Set the start time on the first frame
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure progress doesn't exceed 1

        // Calculate the current cash value based on progress
        const currentAmount = Math.floor(startValue + (endValue - startValue) * progress);
        cashAmountElement.textContent = `$${currentAmount}`;

        // Continue the animation if we haven't reached the target
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            // Finalize at the end value
            cashAmountElement.textContent = `$${endValue}`;
        }
    }

    requestAnimationFrame(updateCount); // Start the animation
}

// Initialize the page and animate cash count-up on load
function initializeCashDisplay() {
    const startCash = 0; // Start at $0
    const endCash = loadCashAmount(); // Get the saved cash amount from localStorage

    // Start the animation from $0 to the saved amount
    animateCashCountUp(startCash, endCash, 800); // Duration: 0.8 seconds
}

// Initialize the game and cash display
initializeCashDisplay();

// Attach event listeners and game setup (your other game logic will go here)
function setupEventListeners() {
    document.querySelectorAll('.winning-number').forEach((winningNumberElement) => {
        winningNumberElement.addEventListener('click', handleWinningNumberClick);
    });

    document.querySelectorAll('.number').forEach((numberElement) => {
        numberElement.addEventListener('click', handleNumberClick);
    });
}

// Function to handle the /set command for setting the cash amount
function setCashAmount(newAmount) {
    saveCashAmount(newAmount);
    updateCashDisplay(newAmount);
}

// Console command for setting the cash amount
window.setCashAmount = function(value) {
    if (typeof value === 'number' && !isNaN(value)) {
        setCashAmount(value);
        console.log(`Cash amount set to $${value}`);
    } else {
        console.log('Invalid amount. Please provide a valid number.');
    }
};
