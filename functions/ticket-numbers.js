// Constant for cash amount key in localStorage
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
    return Math.floor(Math.random() * 30) + 1; // Generates a number between 1 and 30
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
    }

    saveCashAmount(cashAmount);
    updateCashDisplay(cashAmount);

    // Reset selected number after checking
    selectedNumber = null;
}

// Function to update the displayed cash amount
function updateCashDisplay(cashAmount) {
    const cashCounter = document.querySelector('#cash-amount');
    if (cashCounter) {
        cashCounter.textContent = `$${cashAmount}`;
    }
}

// Function to handle the reveal click
function handleRevealClick() {
    console.log('Reveal button clicked'); // Debugging log

    let cashAmount = loadCashAmount(); // Get current cash amount

    // Select all winning-number elements
    const winningNumbers = document.querySelectorAll('.winning-number');
    const userNumbers = document.querySelectorAll('.number');

    // Reveal hidden numbers and hide stars/prizes
    winningNumbers.forEach((winningNumberElement) => {
        const hiddenNumberElement = winningNumberElement.querySelector('.hidden-number');
        const starElement = winningNumberElement.querySelector('.star');
        
        if (hiddenNumberElement && starElement) {
            hiddenNumberElement.style.opacity = '1'; // Reveal hidden number
            starElement.style.opacity = '0'; // Hide the star
        }
    });

    userNumbers.forEach((userNumberElement) => {
        const hiddenNumberElement = userNumberElement.querySelector('.hidden-number');
        const prizeElement = userNumberElement.querySelector('.prize');

        if (hiddenNumberElement && prizeElement) {
            hiddenNumberElement.style.opacity = '1'; // Reveal the number
            prizeElement.style.opacity = '0'; // Hide the prize
        }

        // Check for matches after revealing numbers
        if (hiddenNumberElement) {
            const userNumber = parseInt(hiddenNumberElement.dataset.value, 10);
            const winningNumbersArray = Array.from(
                document.querySelectorAll('.winning-number .hidden-number')
            ).map((el) => parseInt(el.dataset.value, 10));

            // Check if the user number matches any winning number
            if (winningNumbersArray.includes(userNumber)) {
                cashAmount += 5; // Add $5 for each match
                console.log(`Match found for number ${userNumber}! +$5`);
                userNumberElement.classList.add('matched'); // Mark as matched
            }
        }
    });

    // Save and update the cash display after checking matches
    saveCashAmount(cashAmount);
    updateCashDisplay(cashAmount);
}

// Attach event listeners
function setupEventListeners() {
    document.querySelectorAll('.winning-number').forEach((winningNumberElement) => {
        winningNumberElement.addEventListener('click', handleWinningNumberClick);
    });

    document.querySelectorAll('.number').forEach((numberElement) => {
        numberElement.addEventListener('click', handleNumberClick);
    });

    // Attach the reveal functionality to the REVEAL button by ID
    const revealButton = document.getElementById('reveal-numbers'); // Using the new ID
    if (revealButton) {
        revealButton.addEventListener('click', handleRevealClick); // Reveal numbers when clicked
    }
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
