// Save the cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem('cashAmount', amount);
    console.log('Saved cash amount:', amount);
}

// Load the cash amount from localStorage
function loadCashAmount() {
    const amount = localStorage.getItem('cashAmount');
    console.log('Loaded cash amount:', amount);
    return parseInt(amount, 10) || 0;
}