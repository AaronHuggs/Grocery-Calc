// Load history from localStorage on page load
window.onload = function() {
    loadHistory("groceryHistory");
    recalculateAndUpdateTotal("groceryHistory"); // Recalculate total after deletion

    loadHistory("gasHistory");
};

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Change body background color based on the active tab
    changeBodyColor(tabName);

    // Hide all history containers
    var histories = document.getElementsByClassName("calcHistory");
    for (var i = 0; i < histories.length; i++) {
        histories[i].style.display = "none";
    }

    // Show the history container for the active tab
    if (tabName === "Groceries") {
        document.getElementById("groceryHistory").style.display = "block";
    } else if (tabName === "GasPrices") {
        document.getElementById("gasHistory").style.display = "block";
    }
}

// Function to change the body's background color
function changeBodyColor(tabName) {
    var body = document.body;
    if (tabName === "Groceries") {
        body.style.backgroundColor = "#dae8fc"; // Color for Grocery Calculator
    } else if (tabName === "GasPrices") {
        body.style.backgroundColor = "#e1d5e7"; // Color for Gas Prices
    }
}

// Function for validating input
function validateInput(value) {
    return !isNaN(value) && value > 0;
}

// Function to recalculate and update the running total
function recalculateAndUpdateTotal(containerId) {
    var historyContainer = document.getElementById(containerId);
    var totalElementId = containerId.replace("History", "") + "Total";
    var totalElement = document.getElementById(totalElementId);

    if (totalElement) {
        var allEntries = historyContainer.getElementsByClassName('history-content');
        var total = Array.from(allEntries).reduce((sum, entry) => {
            var match = entry.textContent.match(/\$(\d+\.\d\d) CAD$/); // Regex to extract CAD price
            return sum + (match ? parseFloat(match[1]) : 0);
        }, 0);

        totalElement.textContent = `Total: $${total.toFixed(2)} CAD`;
    }
}



// Function to add a history entry and save to localStorage
function addHistoryEntry(containerId, historyText) {
    var historyContainer = document.getElementById(containerId);
    var currentDateTime = new Date().toLocaleString("en-US", {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });

    // Create a new div for each entry
    var div = document.createElement("div");
    div.className = "history-entry";
    div.innerHTML = `
        <div class="history-main-content">
            <button class="delete-history-btn">×</button>
            <span class="history-content">${historyText}</span>
        </div>
        <span class="history-date">${currentDateTime}</span>
    `;

    // Append the new div to the history container
    historyContainer.insertBefore(div, historyContainer.firstChild);

    // Add event listener to the delete button
    var deleteBtn = div.querySelector('.delete-history-btn');
    deleteBtn.addEventListener('click', function() {
        div.remove(); // Remove the entry from the page
        updateLocalStorageAfterDeletion(containerId); // Update localStorage
        recalculateAndUpdateTotal("groceryHistory"); // Recalculate total after deletion

    });

    // Update running total after adding entry
    recalculateAndUpdateTotal("groceryHistory");

    // Save to localStorage
    saveHistory(containerId, div.innerHTML);
}



// Function to update localStorage after an entry is deleted
function updateLocalStorageAfterDeletion(containerId) {
    var historyContainer = document.getElementById(containerId);
    var allEntries = Array.from(historyContainer.getElementsByClassName('history-entry'));
    var updatedEntries = allEntries.map(entry => entry.innerHTML);
    localStorage.setItem(containerId, JSON.stringify(updatedEntries));

    // Recalculate the total after deletion
    recalculateAndUpdateTotal("groceryHistory");

}



// Function to synchronize conversion rates between tabs
function syncConversionRates(sourceId, targetId) {
    var sourceValue = parseFloat(document.getElementById(sourceId).value);
    if (!isNaN(sourceValue) && sourceValue > 0) {
        document.getElementById(targetId).value = sourceValue;
    }
}

// Function to save history to localStorage
function saveHistory(containerId, newEntry) {
    var existingEntries = localStorage.getItem(containerId) ? JSON.parse(localStorage.getItem(containerId)) : [];
    existingEntries.unshift(newEntry);
    localStorage.setItem(containerId, JSON.stringify(existingEntries));
}

// Function to reattach delete event listeners to all delete buttons in a container
function reattachDeleteEventListeners(containerId) {
    var historyContainer = document.getElementById(containerId);
    var deleteButtons = historyContainer.getElementsByClassName('delete-history-btn');

    Array.from(deleteButtons).forEach(button => {
        button.addEventListener('click', function() {
            var entryDiv = button.closest('.history-entry');
            if (entryDiv) {
                entryDiv.remove(); // Remove the entry from the page
                updateLocalStorageAfterDeletion(containerId); // Update localStorage
            }
        });
    });
}

// Function to load history from localStorage
function loadHistory(containerId) {
    var historyContainer = document.getElementById(containerId);
    var entries = localStorage.getItem(containerId) ? JSON.parse(localStorage.getItem(containerId)) : [];
    
    entries.forEach(entryHtml => {
        var div = document.createElement("div");
        div.className = "history-entry";
        div.innerHTML = entryHtml;
        historyContainer.appendChild(div);
    });

    // Reattach event listeners to delete buttons after loading
    reattachDeleteEventListeners(containerId);

    // Update the total
    recalculateAndUpdateTotal("groceryHistory");
}

function clearHistory(containerId) {
    localStorage.removeItem(containerId);
    document.getElementById(containerId).innerHTML = '';
}

// Clear history functions and event listeners
document.getElementById('clearGroceryHistory').addEventListener('click', function() {
    clearHistory("groceryHistory");
});

document.getElementById('clearGasHistory').addEventListener('click', function() {
    clearHistory("gasHistory");
});

// Event listeners for conversion rate inputs
document.getElementById('conversionRate').addEventListener('input', function() {
    syncConversionRates('conversionRate', 'conversionRateGas');
});

document.getElementById('conversionRateGas').addEventListener('input', function() {
    syncConversionRates('conversionRateGas', 'conversionRate');
});

// Grocery Calculator Logic with Error Handling
document.getElementById('calculate').addEventListener('click', function() {
    var itemPrice = parseFloat(document.getElementById('itemPrice').value);
    var conversionRate = parseFloat(document.getElementById('conversionRate').value);
    var itemName = document.getElementById('itemName').value.trim(); // Get item name and trim whitespace


    if (!validateInput(itemPrice) || !validateInput(conversionRate)) {
        alert("Please enter valid numbers for item price and conversion rate.");
        return;
    }

    var bankRate = 0.025; // Bank fee of 2.5%

    var finalUsdPrice = itemPrice;
    var finalCadPrice = itemPrice * conversionRate * (1 + bankRate);
    document.getElementById('cadPrice').innerHTML = `Amount you pay: <strong>$${finalCadPrice.toFixed(2)}</strong> CAD`;



   // Construct the full history entry text with spans for bold styling
   var historyText = (itemName ? `<span class="history-item-name">${itemName}</span>: ` : "") + `$${itemPrice.toFixed(2)} USD -> <span class="history-cad-price">$${finalCadPrice.toFixed(2)}</span> CAD`;
   addHistoryEntry("groceryHistory", historyText);
   recalculateAndUpdateTotal("groceryHistory"); // Recalculate total after adding


    // Clearing the input fields after calculation
    document.getElementById('itemPrice').value = "";
    document.getElementById('itemName').value = ""; // Clear the item name field
    
});

// Gas Prices Calculator Logic with Error Handling
document.getElementById('convertGasPrice').addEventListener('click', function() {
    var gasPriceUSD = parseFloat(document.getElementById('gasPriceUSD').value);
    var conversionRateGas = parseFloat(document.getElementById('conversionRateGas').value);

    if (!validateInput(gasPriceUSD) || !validateInput(conversionRateGas)) {
        alert("Please enter valid numbers for gas price and conversion rate.");
        return;
    }

    var bankRate = 0.025; // Bank fee of 2.5%
    var gallonsToLiters = 3.78541; // Conversion factor from gallons to liters

    var adjustedConversionRate = conversionRateGas * (1 + bankRate);
    var gasPriceCAD = (gasPriceUSD / gallonsToLiters) * adjustedConversionRate;

    document.getElementById('gasPriceCAD').innerHTML = `Amount you pay: <strong>$${gasPriceCAD.toFixed(2)}</strong> CAD`;


    // Construct the full history entry text with span for bold CAD price
    var historyText = `$${gasPriceUSD.toFixed(2)} per gallon -> <span class="history-cad-price">$${gasPriceCAD.toFixed(2)}</span> per liter`;
    addHistoryEntry("gasHistory", historyText);


    // Clearing the input field after calculation
    document.getElementById('gasPriceUSD').value = "";

});

// Set the default open tab (Grocery Calculator)
document.getElementById("defaultOpen").click();
