// Constant for the cash amount key in localStorage
const CASH_AMOUNT_KEY = 'cashAmount';

// Load the current cash amount from localStorage
function loadCashAmount() {
    return parseInt(localStorage.getItem(CASH_AMOUNT_KEY), 10) || 0;
}

// Save the current cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem(CASH_AMOUNT_KEY, amount);
}

// Function to update the displayed cash amount
function updateCashDisplay(cashAmount) {
    const cashCounter = document.querySelector('#cash-amount');
    if (cashCounter) {
        cashCounter.textContent = `$${cashAmount}`;
    }
}

// Function to handle ticket selection
function handleTicketSelection(event) {
    event.preventDefault(); // Prevent navigation by default
    const ticketElement = event.currentTarget;
    const priceText = ticketElement.querySelector('.price').textContent;
    const price = priceText.includes('FREE') ? 0 : parseInt(priceText.replace('$', '').trim(), 10);
    let currentCash = loadCashAmount();

    if (currentCash >= price) {
        // Deduct ticket price from cash and update the display
        currentCash -= price;
        saveCashAmount(currentCash);
        updateCashDisplay(currentCash);
        console.log(`Ticket purchased for $${price}. Remaining cash: $${currentCash}`);
        // Allow navigation after purchase
        window.location.href = ticketElement.href;
    } else {
        console.log('Not enough cash to buy this ticket.');
        alert('Not enough cash to purchase this ticket.');
    }
}

// Function to disable tickets that cannot be afforded and gray them out
function setupTickets() {
    const ticketLinks = document.querySelectorAll('.ticket-claim a');

    ticketLinks.forEach(ticketLink => {
        const priceText = ticketLink.querySelector('.price').textContent;
        const price = priceText.includes('FREE') ? 0 : parseInt(priceText.replace('$', '').trim(), 10);
        const currentCash = loadCashAmount();

        const ticketContainer = ticketLink.parentElement; // Get the container for styling

        if (currentCash < price) {
            // If user can't afford the ticket, make it unclickable and gray it out
            ticketLink.classList.add('disabled');
            ticketLink.style.pointerEvents = 'none';
            ticketContainer.style.opacity = '0.5';
            console.log(`Ticket disabled: Price $${price}, Current Cash $${currentCash}`);
        } else {
            // Otherwise, make the ticket clickable
            ticketLink.classList.remove('disabled');
            ticketLink.style.pointerEvents = 'auto';
            ticketContainer.style.opacity = '1';
            ticketLink.addEventListener('click', handleTicketSelection);
        }
    });
}

// Initialize the ticket system
function initializeTicketSystem() {
    updateCashDisplay(loadCashAmount());
    setupTickets();
}

// Run the ticket system initialization on page load
initializeTicketSystem();
