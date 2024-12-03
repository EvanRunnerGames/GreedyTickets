/*

// Select all ticket-claim elements
const ticketClaims = document.querySelectorAll('.ticket-claim');

// Loop through each ticket-claim element
ticketClaims.forEach(ticketClaim => {
  const ticketLogo = ticketClaim.querySelector('.ticket-logo');

  let scale = 1; // Scale of the logo
  let lastMouseX = 0; // To store the last mouse X position for movement calculation
  let lastMouseY = 0; // To store the last mouse Y position for movement calculation

  // Event listener for mouse move to follow the mouse
  ticketClaim.addEventListener('mousemove', (event) => {
    const rect = ticketClaim.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate the distance between the mouse and the center of the ticket-claim
    const offsetX = mouseX - centerX;
    const offsetY = mouseY - centerY;

    // Move the ticket-logo based on mouse position
    ticketLogo.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  });

  // Event listener for scroll wheel to resize the logo
  ticketClaim.addEventListener('wheel', (event) => {
    // Increase or decrease the scale of the logo based on scroll direction
    if (event.deltaY > 0) {
      scale = Math.max(0.5, scale - 0.1); // Scale down but not below 0.5
    } else {
      scale = Math.min(2, scale + 0.1); // Scale up but not above 2
    }

    // Apply the new scale with the current position
    ticketLogo.style.transform = `scale(${scale})`;

    // Prevent default scroll behavior
    event.preventDefault();
  });

  // Reset all transformations when mouse leaves ticket-claim
  ticketClaim.addEventListener('mouseleave', () => {
    scale = 1; // Reset scale
    ticketLogo.style.transform = `scale(${scale})`; // Apply reset transformation
  });
});

*/

// THIS IS FOR SCROLLING ON THE HORIZONTAL TICKETS

const ticketsClaiming = document.querySelector('.tickets-claiming');

// Auto-scroll settings
let scrollSpeed = 2; // Speed of auto-scroll
let isDragging = false;
let startX, scrollLeft;
let autoScrollInterval;

// Auto-scroll function (creates continuous scrolling)
function autoScroll() {
    ticketsClaiming.scrollLeft += scrollSpeed;

    // Reset scroll to create infinite effect
    if (ticketsClaiming.scrollLeft >= ticketsClaiming.scrollWidth / 2) {
        ticketsClaiming.scrollLeft = 0;
    }
}

// Start auto-scrolling
function startAutoScroll() {
    autoScrollInterval = setInterval(autoScroll, 20);
}

// Stop auto-scrolling
function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Event listeners for drag-to-scroll
ticketsClaiming.addEventListener('mousedown', (e) => {
    stopAutoScroll(); // Stop auto-scroll during dragging
    isDragging = true;
    startX = e.pageX - ticketsClaiming.offsetLeft;
    scrollLeft = ticketsClaiming.scrollLeft;
});

ticketsClaiming.addEventListener('mouseleave', () => {
    isDragging = false;
    startAutoScroll(); // Resume auto-scroll when mouse leaves
});

ticketsClaiming.addEventListener('mouseup', () => {
    isDragging = false;
    startAutoScroll(); // Resume auto-scroll when dragging stops
});

ticketsClaiming.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ticketsClaiming.offsetLeft;
    const walk = (x - startX) * 2; // Adjust this multiplier for drag sensitivity
    ticketsClaiming.scrollLeft = scrollLeft - walk;

    // Reset to seamless scroll if dragging reaches the end
    if (ticketsClaiming.scrollLeft < 0) {
        ticketsClaiming.scrollLeft = ticketsClaiming.scrollWidth / 2;
    } else if (ticketsClaiming.scrollLeft >= ticketsClaiming.scrollWidth / 2) {
        ticketsClaiming.scrollLeft = 0;
    }
});

// Initialize auto-scrolling on page load
startAutoScroll();


//THIS IS FOR COUNTING UP OR DOWN TRANSITION

let currentCashAmount = 0;

function updateCashAmount(newAmount, duration = 1000) {
    const cashElement = document.getElementById('cash-amount');
    const currentAmount = currentCashAmount;
    const difference = newAmount - currentAmount;
    let startTime = null;

    function animateCashAmount(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const increment = Math.min(progress / duration, 1);
        const amountToDisplay = currentAmount + Math.round(difference * increment);

        cashElement.innerText = `$${amountToDisplay.toLocaleString()}`;

        if (progress < duration) {
            requestAnimationFrame(animateCashAmount);
        } else {
            cashElement.innerText = `$${newAmount.toLocaleString()}`; // Ensure it ends exactly at the new value
            currentCashAmount = newAmount; // Update the current cash amount
        }
    }

    requestAnimationFrame(animateCashAmount);
}

// This function will be called if the cash amount is updated manually in the DOM
function syncCurrentCashAmount() {
    const cashElement = document.getElementById('cash-amount');
    const text = cashElement.innerText.replace('$', '').replace(',', '');
    const newAmount = parseInt(text) || 0;

    if (newAmount !== currentCashAmount) {
        updateCashAmount(newAmount);
    }
}

// Use MutationObserver to detect changes in the cash amount directly in the DOM
const observer = new MutationObserver(syncCurrentCashAmount);

// Observe changes in the text content of the cash-amount element
observer.observe(document.getElementById('cash-amount'), {
    childList: true, // Detect changes to child nodes (text content)
    subtree: true // Observe all descendants (useful for nested structures)
});

// Example usage - whenever you want to update the cash amount in the script
function setCashAmount(newAmount) {
    if (newAmount !== currentCashAmount) {
        updateCashAmount(newAmount);
    }
}



