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
}

// Function to change the body's background color
function changeBodyColor(tabName) {
    var body = document.body;
    if (tabName === "GroceryCalculator") {
        body.style.backgroundColor = "#dae8fc"; // Color for Grocery Calculator
    } else if (tabName === "GasPrices") {
        body.style.backgroundColor = "#e1d5e7"; // Color for Gas Prices
    }
}

// Default open tab
document.getElementById("defaultOpen").click();

// Grocery Calculator Logic
document.getElementById('calculate').addEventListener('click', function() {
    var itemPrice = parseFloat(document.getElementById('itemPrice').value);
    var conversionRate = parseFloat(document.getElementById('conversionRate').value);

    // Constants
    var bellinghamTax = 0.088; // 8.8%
    //var bcTax = 0.12; // 12%
    var bankRate = 0.025; // Bank fee of 2.5%

    var finalUsdPrice = itemPrice * (1 + bellinghamTax);
    var adjustedConversionRate = conversionRate * (1 + bankRate);
    var finalCadPrice = finalUsdPrice * adjustedConversionRate;
    //var finalBcPrice = finalCadPrice * (1 + bcTax);

    document.getElementById('cadPrice').textContent = 'Price Paid in Bellingham (CAD): ' + finalCadPrice.toFixed(2) + ' CAD';
    //document.getElementById('bcPrice').textContent = 'Equivalent Price in BC (CAD): ' + finalBcPrice.toFixed(2) + ' CAD';
});

// Gas Prices Calculator Logic
document.getElementById('convertGasPrice').addEventListener('click', function() {
    var gasPriceUSD = parseFloat(document.getElementById('gasPriceUSD').value);
    var conversionRateGas = parseFloat(document.getElementById('conversionRateGas').value);
    var bankRate = 0.025; // Bank fee of 2.5%
    var gallonsToLiters = 3.78541; // Conversion factor from gallons to liters

    // Adjusting the conversion rate for the bank fee
    var adjustedConversionRate = conversionRateGas * (1 + bankRate);

    // Converting price from USD per gallon to CAD per liter
    var gasPriceCAD = (gasPriceUSD / gallonsToLiters) * adjustedConversionRate;

    document.getElementById('gasPriceCAD').textContent = 'Price in CAD per Liter: ' + gasPriceCAD.toFixed(2) + ' CAD';
});
