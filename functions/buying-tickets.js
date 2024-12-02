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
    const ticketElement = event.currentTarget;
    const ticketPriceElement = ticketElement.querySelector('.price');
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
        // Prevent default action
        event.preventDefault();
        console.log('Not enough cash to buy this ticket.');
    }
}

// Function to set up ticket event listeners
function setupTicketEventListeners() {
    // Get all ticket elements
    const ticketLinks = document.querySelectorAll('.ticket-claim a');

    // Add click event listeners to all ticket elements
    ticketLinks.forEach(linkElement => {
        const ticketElement = linkElement.closest('.ticket-claim');
        const ticketPriceElement = ticketElement.querySelector('.price');
        const ticketPrice = parseInt(ticketPriceElement.textContent.replace('$', '').trim(), 10);
        
        let currentCash = loadCashAmount();

        // Disable the link if price is higher than user's current cash
        if (currentCash < ticketPrice) {
            linkElement.classList.add('disabled');
            linkElement.removeAttribute('href'); // Remove href to disable navigation
            ticketElement.style.opacity = '0.5';  // Indicate it's disabled
            console.log(`Ticket disabled: Not enough cash for ticket priced at $${ticketPrice}`);
        } else {
            linkElement.classList.remove('disabled');
            ticketElement.style.opacity = '1'; // Restore appearance
            linkElement.addEventListener('click', handleTicketClick);
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
