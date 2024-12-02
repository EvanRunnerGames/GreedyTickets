// Function to load the current cash amount from localStorage
function loadCashAmount() {
    return parseInt(localStorage.getItem('cashAmount'), 10) || 0;
}

// Function to save the current cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem('cashAmount', amount);
}

// Function to update the cash display
function updateCashDisplay(cashAmount) {
    const cashCounter = document.querySelector('#cash-amount');
    if (cashCounter) {
        cashCounter.textContent = `$${cashAmount}`;
    }
}

// Function to handle ticket click
function handleTicketClick(event) {
    const ticketPriceElement = event.currentTarget.querySelector('.price');
    const ticketPrice = parseInt(ticketPriceElement.textContent.replace('$', '').trim(), 10);
    let currentCash = loadCashAmount();

    // Check if the user has enough cash
    if (currentCash >= ticketPrice) {
        // Deduct the price from the user's cash
        currentCash -= ticketPrice;
        saveCashAmount(currentCash);
        updateCashDisplay(currentCash);
        console.log(`Ticket bought for $${ticketPrice}. Remaining cash: $${currentCash}`);
    } else {
        // Disable the ticket if not enough cash
        event.preventDefault();
        console.log('Not enough cash to buy this ticket.');
    }
}

// Function to set up ticket event listeners
function setupTicketEventListeners() {
    // Get all ticket elements
    const ticketElements = document.querySelectorAll('.ticket-claim');

    // Add click event listeners to all ticket elements
    ticketElements.forEach(ticketElement => {
        const ticketPriceElement = ticketElement.querySelector('.price');
        const ticketPrice = parseInt(ticketPriceElement.textContent.replace('$', '').trim(), 10);
        
        // Disable the link if price is higher than user's current cash
        let currentCash = loadCashAmount();
        if (currentCash < ticketPrice) {
            ticketElement.style.opacity = '0.5';  // Reduce opacity to indicate it's disabled
            ticketElement.style.pointerEvents = 'none';  // Disable clicks
        } else {
            // Enable click functionality
            ticketElement.style.opacity = '1';
            ticketElement.style.pointerEvents = 'auto';
            ticketElement.addEventListener('click', handleTicketClick);
        }
    });
}

// Initialize the ticket setup
function initializeTicketSystem() {
    updateCashDisplay(loadCashAmount());
    setupTicketEventListeners();
}

// Call the function to initialize ticket system on page load
initializeTicketSystem();
