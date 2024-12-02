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
        // Prevent the default action if not enough cash
        event.preventDefault();
        console.log('Not enough cash to buy this ticket.');
    }
}

// Function to set up ticket event listeners
function setupTicketEventListeners() {
    // Get all ticket elements
    const ticketElements = document.querySelectorAll('.ticket-claim');

    // Iterate over each ticket element
    ticketElements.forEach(ticketElement => {
        const ticketPriceElement = ticketElement.querySelector('.price');
        const ticketPrice = parseInt(ticketPriceElement.textContent.replace('$', '').trim(), 10);

        // Get the current cash amount
        let currentCash = loadCashAmount();

        // Access the parent <a> tag
        const linkElement = ticketElement.closest('a');

        // If the price is higher than the user's current cash, disable the ticket
        if (currentCash < ticketPrice) {
            linkElement.classList.add('disabled-ticket');  // Add the disabled class to <a>
            linkElement.setAttribute('href', '#');         // Change href to '#'
            linkElement.style.pointerEvents = 'none';      // Disable clicks on the <a> tag
        } else {
            // Enable click functionality for eligible tickets
            linkElement.classList.remove('disabled-ticket'); // Remove the disabled class from <a>
            linkElement.style.opacity = '1';                 // Ensure opacity is normal
            linkElement.style.pointerEvents = 'auto';        // Enable clicks on the <a> tag
            linkElement.addEventListener('click', handleTicketClick);
        }
    });
}

// Initialize the ticket system
function initializeTicketSystem() {
    updateCashDisplay(loadCashAmount());
    setupTicketEventListeners();
}

// Call the function to initialize the ticket system on page load
initializeTicketSystem();
