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
    return Math.floor(Math.random() * 60) + 1; // Generates a number between 1 and 60
}

// Function to initialize random numbers for .winning-number elements with no duplicates
function initializeWinningNumbers() {
    const usedNumbers = new Set(); // Set to track used numbers for winning numbers
    
    document.querySelectorAll('.winning-number .hidden-number').forEach((hiddenNumberElement) => {
        let randomNumber;
        
        // Ensure the random number is unique for .winning-number elements
        do {
            randomNumber = generateRandomNumber();
        } while (usedNumbers.has(randomNumber)); // If the number is already used, regenerate
        
        hiddenNumberElement.textContent = randomNumber;
        hiddenNumberElement.dataset.value = randomNumber; // Store number in dataset
        usedNumbers.add(randomNumber); // Add to set of used numbers for winning numbers
    });
}

// Function to initialize random numbers for .number elements
function initializeNumberElements() {
    document.querySelectorAll('.number .hidden-number').forEach((hiddenNumberElement) => {
        const randomNumber = generateRandomNumber(); // No need for duplicates check here
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

    disableRevealButton(); // Disable reveal button after any number is clicked
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

    disableRevealButton(); // Disable reveal button after any number is clicked
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

    // Select the reveal-numbers div and add the 'disabled-ticket' class
    const revealButton = document.getElementById('reveal-numbers');
    if (revealButton) {
        revealButton.classList.add('disabled-ticket'); // Add the 'disabled-ticket' class
        revealButton.style.opacity = 0.5; // Optional: visually indicate it's disabled
    }

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

// Function to disable the reveal button
function disableRevealButton() {
    const revealButton = document.getElementById('reveal-numbers');
    if (revealButton) {
        revealButton.classList.add('disabled-ticket'); // Add disabled class
        revealButton.style.opacity = 0.5; // Optional: visually indicate it's disabled
        revealButton.removeEventListener('click', handleRevealClick); // Remove the reveal click event
    }
}

// Function to enable the reveal button
function enableRevealButton() {
    const revealButton = document.getElementById('reveal-numbers');
    if (revealButton) {
        revealButton.classList.remove('disabled-ticket'); // Remove disabled class
        revealButton.style.opacity = 1; // Restore opacity
        revealButton.addEventListener('click', handleRevealClick); // Re-enable the reveal button click event
    }
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
    initializeWinningNumbers(); // Initialize unique winning numbers
    initializeNumberElements(); // Initialize .number elements
    // Remove the 'matched' class from all numbers
    document.querySelectorAll('.number').forEach((numberElement) => {
        numberElement.classList.remove('matched');
    });

    enableRevealButton(); // Re-enable the reveal button when the game is reset
}

// Initialize the game
function initializeGame() {
    initializeWinningNumbers(); // Initialize unique winning numbers
    initializeNumberElements(); // Initialize .number elements
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
