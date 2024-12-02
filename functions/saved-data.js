const CASH_AMOUNT_KEY = 'cashAmount';

// Save the cash amount to localStorage
function saveCashAmount(amount) {
    localStorage.setItem(CASH_AMOUNT_KEY, amount);
}

// Load the cash amount from localStorage
function loadCashAmount() {
    return parseInt(localStorage.getItem(CASH_AMOUNT_KEY), 10) || 0;
}
