document.getElementById('calculate').addEventListener('click', function() {
    var itemPrice = parseFloat(document.getElementById('itemPrice').value);
    var conversionRate = parseFloat(document.getElementById('conversionRate').value);

    // Fixed values
    var bellinghamTax = 0.088; // 8.8%
    var bcTax = 0.12; // 12%
    var bankRate = 0.025; // Bank fee of 2.5%

    var finalUsdPrice = itemPrice * (1 + bellinghamTax);
    var adjustedConversionRate = conversionRate * (1 + bankRate);
    var finalCadPrice = finalUsdPrice * adjustedConversionRate;
    var finalBcPrice = finalCadPrice * (1 + bcTax);

    document.getElementById('cadPrice').textContent = 'CAD Price: ' + finalCadPrice.toFixed(2) + ' CAD';
    document.getElementById('bcPrice').textContent = 'Price with BC Tax: ' + finalBcPrice.toFixed(2) + ' CAD';
});
