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

// Function to add a history entry
function addHistoryEntry(containerId, input, output) {
    var historyContainer = document.getElementById(containerId);
    var currentDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    var historyEntry = input + " -> " + output.toFixed(2) + "              " + currentDate;
    
    // Create a new paragraph for each entry
    var p = document.createElement("p");
    p.textContent = historyEntry;
    historyContainer.insertBefore(p, historyContainer.firstChild);
}

// Function to synchronize conversion rates between tabs
function syncConversionRates(sourceId, targetId) {
    var sourceValue = parseFloat(document.getElementById(sourceId).value);
    if (!isNaN(sourceValue) && sourceValue > 0) {
        document.getElementById(targetId).value = sourceValue;
    }
}

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

    if (!validateInput(itemPrice) || !validateInput(conversionRate)) {
        alert("Please enter valid numbers for item price and conversion rate.");
        return;
    }

    var bellinghamTax = 0.088; // 8.8%
    var bankRate = 0.025; // Bank fee of 2.5%

    var finalUsdPrice = itemPrice * (1 + bellinghamTax);
    var adjustedConversionRate = conversionRate * (1 + bankRate);
    var finalCadPrice = finalUsdPrice * adjustedConversionRate;

    document.getElementById('cadPrice').textContent = 'Price Paid in Bellingham (CAD): ' + finalCadPrice.toFixed(2) + ' CAD';

    addHistoryEntry("groceryHistory", itemPrice.toFixed(2), finalCadPrice);
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

    document.getElementById('gasPriceCAD').textContent = 'Price in CAD per Liter: ' + gasPriceCAD.toFixed(2) + ' CAD';

    addHistoryEntry("gasHistory", gasPriceUSD.toFixed(2), gasPriceCAD);

});

// Set the default open tab (Grocery Calculator)
document.getElementById("defaultOpen").click();
