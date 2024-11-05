document.getElementById('tradeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const symbol = document.getElementById('symbol').value;
    const entryDate = document.getElementById('entryDate').value;
    const entryPrice = document.getElementById('entryPrice').value;
    const exitDate = document.getElementById('exitDate').value;
    const exitPrice = document.getElementById('exitPrice').value;
    const quantity = document.getElementById('quantity').value;

    // Validate input fields
    if (!symbol || !entryDate || !entryPrice || !quantity) {
        alert('Please fill in all required fields.');
        return;
    }

    // Add the new trade to the table
    addTrade(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity);

    // Clear form fields after submission
    document.getElementById('tradeForm').reset();
});

function addTrade(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity) {
    const table = document.getElementById('tradeTable').querySelector('tbody');
    
    // Create a new row
    const row = table.insertRow();

    // Insert cells and fill with data
    row.insertCell(0).innerText = symbol;
    row.insertCell(1).innerText = entryDate;
    row.insertCell(2).innerText = entryPrice;
    row.insertCell(3).innerText = exitDate || '-'; // Optional field
    row.insertCell(4).innerText = exitPrice || '-'; // Optional field
    row.insertCell(5).innerText = quantity;

    // Create action buttons (Edit and Delete)
    const actionsCell = row.insertCell(6);
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.style.backgroundColor = 'blue';  // Color for Edit button
    editBtn.addEventListener('click', function() {
        editTrade(row);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.style.backgroundColor = 'red';  // Color for Delete button
    deleteBtn.addEventListener('click', function() {
        confirmDelete(row);
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
}

function editTrade(row) {
    // Fill the form with the row data for editing
    const cells = row.getElementsByTagName('td');
    document.getElementById('symbol').value = cells[0].innerText;
    document.getElementById('entryDate').value = cells[1].innerText;
    document.getElementById('entryPrice').value = cells[2].innerText;
    document.getElementById('exitDate').value = cells[3].innerText !== '-' ? cells[3].innerText : '';
    document.getElementById('exitPrice').value = cells[4].innerText !== '-' ? cells[4].innerText : '';
    document.getElementById('quantity').value = cells[5].innerText;

    // Remove the current row from the table (we will re-add it after editing)
    row.remove();
}

function confirmDelete(row) {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'block';

    // Handle confirmation
    document.getElementById('confirmDelete').onclick = function() {
        row.remove();
        modal.style.display = 'none';
    };

    // Handle cancellation
    document.getElementById('cancelDelete').onclick = function() {
        modal.style.display = 'none';
    };
}


    // Stock Search Code (runs only if stockSearchForm exists on the page)
    const stockSearchForm = document.getElementById('stockSearchForm');
    const searchResult = document.getElementById('searchResult');
    const resultSymbol = document.getElementById('resultSymbol');
    const resultPrice = document.getElementById('resultPrice');
    const resultMarketCap = document.getElementById('resultMarketCap');
    const addToWatchlistBtn = document.getElementById('addToTradesbtn');

    if (stockSearchForm) {
        stockSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get search query
            const query = document.getElementById('searchQuery').value.trim().toUpperCase();
            
            // Display search result (mocked data)
            resultSymbol.textContent = query;
            resultPrice.textContent = (Math.random() * 100 + 50).toFixed(2); // Random price for demonstration
            resultMarketCap.textContent = `${Math.floor(Math.random() * 900 + 100)}B`; // Random market cap for demonstration

            // Show the search result section
            searchResult.style.display = 'block';
            
            // Clear search input
            stockSearchForm.reset();
        });

        // Redirect to Trades page with symbol when "Add to Watchlist" is clicked
        addToWatchlistBtn.addEventListener('click', () => {
            const symbol = resultSymbol.textContent;
            window.location.href = `trades.html?symbol=${encodeURIComponent(symbol)}`;
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const compareForm = document.getElementById('compareForm');
    const comparisonResult = document.getElementById('comparisonResult');

    if (compareForm) {
        compareForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capture input values for Stock 1
            const symbol1 = document.getElementById('symbol1').value.toUpperCase();
            const price1 = parseFloat(document.getElementById('price1').value).toFixed(2);
            const peRatio1 = document.getElementById('peRatio1').value || 'N/A';
            const marketCap1 = document.getElementById('marketCap1').value || 'N/A';

            // Capture input values for Stock 2
            const symbol2 = document.getElementById('symbol2').value.toUpperCase();
            const price2 = parseFloat(document.getElementById('price2').value).toFixed(2);
            const peRatio2 = document.getElementById('peRatio2').value || 'N/A';
            const marketCap2 = document.getElementById('marketCap2').value || 'N/A';

            // Display results in the comparison table
            document.getElementById('resultSymbol1').textContent = symbol1;
            document.getElementById('resultSymbol2').textContent = symbol2;
            document.getElementById('resultPrice1').textContent = `$${price1}`;
            document.getElementById('resultPrice2').textContent = `$${price2}`;
            document.getElementById('resultPERatio1').textContent = peRatio1;
            document.getElementById('resultPERatio2').textContent = peRatio2;
            document.getElementById('resultMarketCap1').textContent = `${marketCap1}B`;
            document.getElementById('resultMarketCap2').textContent = `${marketCap2}B`;

            // Show the comparison result section
            comparisonResult.style.display = 'block';

            // Reset the form for future comparisons
            compareForm.reset();
        });
    }
});
