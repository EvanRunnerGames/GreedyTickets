// Save the cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem('cashAmount', amount);
    console.log('Saved cash amount:', amount); // Log the value being saved
}

// Load the cash amount from localStorage
function loadCashAmount() {
    const amount = localStorage.getItem('cashAmount');
    const parsedAmount = parseInt(amount, 10);

    if (isNaN(parsedAmount)) {
        console.log('No valid cash amount found, returning 0');
        return 0; // If not a valid number, return 0
    }

    console.log('Loaded cash amount:', parsedAmount); // Log the parsed value
    return parsedAmount;
}
