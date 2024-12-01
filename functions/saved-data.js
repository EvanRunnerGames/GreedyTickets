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

// Utility to generate random numbers
function generateRandomNumber() {
    return Math.floor(Math.random() * 70) + 1; // Generates a number between 1 and 70
}

// Initialize random numbers for all hidden-number elements
function initializeHiddenNumbers() {
    document.querySelectorAll('.hidden-number').forEach((hiddenNumberElement) => {
        const randomNumber = generateRandomNumber();
        hiddenNumberElement.textContent = randomNumber;
        hiddenNumberElement.dataset.value = randomNumber; // Store number in dataset
    });
}

// Track the selected numbers
let selectedNumber = null;

// Function to handle when a .winning-number is clicked
function handleWinningNumberClick(event) {
    const winningNumberElement = event.currentTarget;
    const starElement = winningNumberElement.querySelector('.star');
    const hiddenNumberElement = winningNumberElement.querySelector('.hidden-number');

    if (starElement && hiddenNumberElement) {
        starElement.style.opacity = 0; // Hide star
        hiddenNumberElement.style.opacity = 1; // Show hidden number
    }
}

// Function to handle when a .number is clicked
function handleNumberClick(event) {
    const numberElement = event.currentTarget;
    const prizeElement = numberElement.querySelector('.prize');
    const hiddenNumberElement = numberElement.querySelector('.hidden-number');

    if (prizeElement && hiddenNumberElement) {
        prizeElement.style.opacity = 0; // Hide prize
        hiddenNumberElement.style.opacity = 1; // Show hidden number
    }

    // Avoid earning cash multiple times from the same number
    if (numberElement.classList.contains('matched')) {
        return; // Exit if the number has already been matched
    }

    selectedNumber = parseInt(hiddenNumberElement.dataset.value, 10); // Store user selected number

    // Check for matches only if a number is selected
    if (selectedNumber !== null) {
        checkMatches(numberElement);
    }
}

// Function to check if a selected number matches any winning number
function checkMatches(numberElement) {
    const winningNumbers = Array.from(
        document.querySelectorAll('.winning-number .hidden-number')
    ).map((el) => parseInt(el.dataset.value, 10));

    let cashAmount = loadCashAmount();

    // Check if the selected number matches any of the winning numbers
    if (winningNumbers.includes(selectedNumber)) {
        cashAmount += 5; // Add $5 for each match
        console.log('Match found! +$5');
        
        // Mark this number as matched by adding a class
        numberElement.classList.add('matched');

        // Animate cash increase with a count-up effect
        animateCashCountUp(loadCashAmount(), cashAmount, 800); // 0.8 seconds duration
    }

    saveCashAmount(cashAmount);
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

// Attach event listeners
function setupEventListeners() {
    document.querySelectorAll('.winning-number').forEach((winningNumberElement) => {
        winningNumberElement.addEventListener('click', handleWinningNumberClick);
    });

    document.querySelectorAll('.number').forEach((numberElement) => {
        numberElement.addEventListener('click', handleNumberClick);
    });
}

// Reset game data
function resetGame() {
    localStorage.setItem(CASH_AMOUNT_KEY, '0');
    updateCashDisplay(0);
    initializeHiddenNumbers();
    // Remove the 'matched' class from all numbers
    document.querySelectorAll('.number').forEach((numberElement) => {
        numberElement.classList.remove('matched');
    });
}

// Initialize the game
function initializeGame() {
    initializeHiddenNumbers();
    updateCashDisplay(loadCashAmount());
    setupEventListeners();
}

// Start the game logic
initializeGame();

// Function to handle the /set command for setting the cash amount
function setCashAmount(newAmount) {
    // Prevent infinite recursion
    if (newAmount === loadCashAmount()) return; // Exit if the amount is the same as the current one
    
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
