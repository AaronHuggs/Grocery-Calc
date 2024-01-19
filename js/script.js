
/*-- Initial Setup and DOM References --*/
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const descriptionInput = document.getElementById('description');
    const taxCheckbox = document.getElementById('tax');
    const listSelect = document.getElementById('list-select');
    const newListNameInput = document.getElementById('new-list-name');
    const addListButton = document.getElementById('add-list');
    const deleteListButton = document.getElementById('delete-list');
    const calculateButton = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');
    const listsDiv = document.querySelector('.lists');
    let lists = {};

    /*-- Loading Lists from Local Storage --*/
    function loadLists() {
        const savedLists = localStorage.getItem('shoppingLists');
        if (savedLists) {
            lists = JSON.parse(savedLists);
            Object.keys(lists).forEach(listName => {
                addListToDropdown(listName);
                renderList(listName);
            });
        }
        // Set the last selected list as default
        const lastSelectedList = localStorage.getItem('lastSelectedList');
        if (lastSelectedList && lists.hasOwnProperty(lastSelectedList)) {
            listSelect.value = lastSelectedList;
        }
    }

    function addListToDropdown(listName) {
        const newOption = document.createElement('option');
        newOption.value = listName;
        newOption.textContent = listName;
        listSelect.appendChild(newOption);
    }

    /*-- Saving Lists to Local Storage --*/
    function saveLists() {
        localStorage.setItem('shoppingLists', JSON.stringify(lists));
    }

    /*-- Adding New List --*/
    addListButton.addEventListener('click', function() {
        const newListName = newListNameInput.value.trim();
        if (newListName && !(newListName in lists)) {
            lists[newListName] = [];
            addListToDropdown(newListName);
            newListNameInput.value = '';
            saveLists();
            // Save the last created list name
            localStorage.setItem('lastSelectedList', newListName);
        }
    });

    /*-- Deleting a List --*/
    deleteListButton.addEventListener('click', function() {
        const listName = listSelect.value;
        if (listName && confirm('Are you sure you want to delete this list?')) {
            delete lists[listName];
            listSelect.removeChild(listSelect.querySelector('option[value="' + listName + '"]'));
            const listDiv = document.getElementById('list-' + listName);
            if (listDiv) {
                listDiv.remove();
            }
            saveLists();
        }
    });

    /*-- Calculating and Adding Items --*/
    calculateButton.addEventListener('click', function() {
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        const description = descriptionInput.value.trim();
        const addTax = taxCheckbox.checked;
        const listName = listSelect.value;

        // Check if a list is selected
        if (!listName) {
            listSelect.classList.add('highlight-required');
            return; // Stop further execution
        } else {
            listSelect.classList.remove('highlight-required');
        }
    
        if (!isNaN(price) && !isNaN(quantity) && description && listName) {
            let totalPrice = price * quantity;
            if (addTax) {
                totalPrice *= 1.088; // Add 8.8% tax
            }
            const totalPriceCAD = totalPrice * 1.38; // Conversion to CAD
    
            resultDiv.textContent = `${description}: $${totalPrice.toFixed(2)} USD -> $${totalPriceCAD.toFixed(2)} CAD`;
    
            // Add item to the list in descending order
            lists[listName].unshift({
                description,
                priceUSD: totalPrice.toFixed(2),
                priceCAD: totalPriceCAD.toFixed(2),
                taxApplied: addTax // Store whether tax was applied
            });
    
            renderList(listName);
            saveLists();

            // Clear item price and description inputs, reset quantity to 1
            priceInput.value = '';
            descriptionInput.value = '';
            quantityInput.value = 1;
            taxCheckbox.checked = false;
        }
    });
    

    /*-- Rendering List and Removing Items --*/
    function renderList(listName) {
        let listDiv = document.getElementById('list-' + listName);
        if (!listDiv) {
            listDiv = document.createElement('div');
            listDiv.id = 'list-' + listName;
            listDiv.classList.add('list');
            listsDiv.insertBefore(listDiv, listsDiv.firstChild);
        }
        listDiv.innerHTML = '<h2>' + listName + '</h2>';

        let totalUSD = 0, totalCAD = 0;
        lists[listName].forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-item');
            // Apply the 'tax-applied' class if tax was applied
            const descriptionClass = item.taxApplied ? 'tax-applied' : '';
            itemDiv.innerHTML = `<span class="${descriptionClass}">${item.description}</span>: $${item.priceUSD} USD -> $${item.priceCAD} CAD
            <span class="remove-item" onclick="removeItem('${listName}', ${index})">x</span>`;
            listDiv.insertBefore(itemDiv, listDiv.firstChild.nextSibling); // Inserting at the top
            totalUSD += parseFloat(item.priceUSD);
            totalCAD += parseFloat(item.priceCAD);
        });

        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<h3><strong>Total:</strong> $${totalUSD.toFixed(2)} USD -> <strong>$${totalCAD.toFixed(2)} CAD</strong></h3>`;
        listDiv.appendChild(totalDiv);
    }

    window.removeItem = function(listName, index) {
        lists[listName].splice(index, 1);
        renderList(listName);
        saveLists();
    };

    loadLists(); // Load lists when the page loads

    // Tooltip toggle functionality
    document.addEventListener('DOMContentLoaded', function() {
        const salesTaxText = document.getElementById('salesTaxText');
        const salesTaxTooltip = document.getElementById('salesTaxTooltip');
    
        salesTaxText.addEventListener('click', function() {
            salesTaxTooltip.style.display = salesTaxTooltip.style.display === 'block' ? 'none' : 'block';
        });
    });
});

