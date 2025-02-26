let lastDeletedTrade = null; // To store the last deleted trade for undo functionality

// Handle form submission for adding a trade
document.getElementById('tradeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const symbol = document.getElementById('symbol').value.trim();  // No symbol validation
    const entryDate = document.getElementById('entryDate').value;
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const exitDate = document.getElementById('exitDate').value;
    const exitPrice = parseFloat(document.getElementById('exitPrice').value) || null;
    const quantity = parseInt(document.getElementById('quantity').value);

    // Check for required fields, but NOT for symbol
    if (!entryDate || isNaN(entryPrice) || isNaN(quantity)) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    // Add the new trade to the table
    addTrade(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity);

    // Save the trade to localStorage
    saveTradeToLocalStorage(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity);

    // Clear form fields after submission
    document.getElementById('tradeForm').reset();
});

// Function to add a trade to the table
function addTrade(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity) {
    const table = document.getElementById('tradeTable').querySelector('tbody');

    // Create a new row
    const row = table.insertRow();

    // Insert cells and fill with data
    row.insertCell(0).innerText = symbol || '-';  // Default to '-' if no symbol is entered
    row.insertCell(1).innerText = entryDate;
    row.insertCell(2).innerText = `$${entryPrice.toFixed(2)}`;
    row.insertCell(3).innerText = exitDate || '-'; // Optional field
    row.insertCell(4).innerText = exitPrice ? `$${exitPrice.toFixed(2)}` : '-'; // Optional field
    row.insertCell(5).innerText = quantity;

    // Create action buttons (Edit and Delete)
    const actionsCell = row.insertCell(6);
    actionsCell.style.textAlign = 'center';

    const editBtn = createActionButton('Edit', 'blue', 'white', function () {
        editTrade(row);
    });

    const deleteBtn = createActionButton('Delete', 'red', 'white', function () {
        confirmDelete(row);
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    // Call the sort function every time a trade is added to ensure the table remains sorted
    sortTable(document.getElementById('sortOptions').value);
}

// Function to create reusable action buttons
function createActionButton(text, bgColor, textColor, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.backgroundColor = bgColor;
    button.style.color = textColor;
    button.style.marginRight = '10px';
    button.addEventListener('click', onClick);
    return button;
}

// Function to edit a trade
function editTrade(row) {
    const cells = row.getElementsByTagName('td');
    document.getElementById('symbol').value = cells[0].innerText;
    document.getElementById('entryDate').value = cells[1].innerText;
    document.getElementById('entryPrice').value = parseFloat(cells[2].innerText.replace('$', ''));
    document.getElementById('exitDate').value = cells[3].innerText !== '-' ? cells[3].innerText : '';
    document.getElementById('exitPrice').value = cells[4].innerText !== '-' ? parseFloat(cells[4].innerText.replace('$', '')) : '';
    document.getElementById('quantity').value = cells[5].innerText;

    // Remove the old row from table and localStorage
    removeTradeFromLocalStorage(row);
    row.remove();
}

// Function to confirm deletion
function confirmDelete(row) {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'block';

    document.getElementById('confirmDelete').onclick = function () {
        lastDeletedTrade = row.cloneNode(true); // Clone the row and save it
        lastDeletedTrade.originalRow = row; // Store a reference to the original row
        row.remove();
        modal.style.display = 'none';
        document.getElementById('undoButton').style.display = 'block'; // Show undo button
        removeTradeFromLocalStorage(row);  // Remove from localStorage
    };

    document.getElementById('cancelDelete').onclick = function () {
        modal.style.display = 'none';
    };
}

// Undo functionality
document.getElementById('undoButton').addEventListener('click', function () {
    if (lastDeletedTrade) {
        const table = document.getElementById('tradeTable').querySelector('tbody');
        const restoredRow = lastDeletedTrade;
        table.appendChild(restoredRow); // Re-add the last deleted row

        // Reattach event listeners to the restored row's buttons
        const actionsCell = restoredRow.cells[6];
        actionsCell.innerHTML = ''; // Clear old buttons

        const editBtn = createActionButton('Edit', 'blue', 'white', function () {
            editTrade(restoredRow);
        });

        const deleteBtn = createActionButton('Delete', 'red', 'white', function () {
            confirmDelete(restoredRow);
        });

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        lastDeletedTrade = null;
        document.getElementById('undoButton').style.display = 'none'; // Hide undo button

        // Add the restored trade back to localStorage
        saveTradeToLocalStorage(
            restoredRow.cells[0].innerText,
            restoredRow.cells[1].innerText,
            parseFloat(restoredRow.cells[2].innerText.replace('$', '')),
            restoredRow.cells[3].innerText,
            restoredRow.cells[4].innerText !== '-' ? parseFloat(restoredRow.cells[4].innerText.replace('$', '')) : null,
            parseInt(restoredRow.cells[5].innerText)
        );
    }
});

// Sorting function
document.getElementById('sortOptions').addEventListener('change', function () {
    const sortOption = this.value;
    sortTable(sortOption);
});

// Function to sort the table based on selected option
function sortTable(sortOption) {
    const table = document.getElementById('tradeTable');
    const rows = Array.from(table.querySelectorAll('tbody tr')); // Get all rows in the table body
    let sortedRows;

    // Sorting logic based on the selected sort option
    switch (sortOption) {
        case 'symbol-asc':
            sortedRows = rows.sort((a, b) => a.cells[0].innerText.localeCompare(b.cells[0].innerText));
            break;
        case 'symbol-desc':
            sortedRows = rows.sort((a, b) => b.cells[0].innerText.localeCompare(a.cells[0].innerText));
            break;
        case 'entryDate-asc':
            sortedRows = rows.sort((a, b) => new Date(a.cells[1].innerText) - new Date(b.cells[1].innerText));  // Sort by entry date
            break;
        case 'entryDate-desc':
            sortedRows = rows.sort((a, b) => new Date(b.cells[1].innerText) - new Date(a.cells[1].innerText));  // Sort by entry date in reverse order
            break;
        case 'quantity-asc':
            sortedRows = rows.sort((a, b) => parseInt(a.cells[5].innerText) - parseInt(b.cells[5].innerText));  // Sort by quantity
            break;
        case 'quantity-desc':
            sortedRows = rows.sort((a, b) => parseInt(b.cells[5].innerText) - parseInt(a.cells[5].innerText));  // Sort by quantity in reverse order
            break;
        default:
            sortedRows = rows; // Default if no sorting is selected
    }

    // Rebuild the table with sorted rows
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows
    sortedRows.forEach(row => tbody.appendChild(row)); // Append sorted rows

    // Update localStorage to reflect sorted data
    const updatedTrades = sortedRows.map(row => ({
        symbol: row.cells[0].innerText,
        entryDate: row.cells[1].innerText,
        entryPrice: parseFloat(row.cells[2].innerText.replace('$', '')),
        exitDate: row.cells[3].innerText,
        exitPrice: row.cells[4].innerText !== '-' ? parseFloat(row.cells[4].innerText.replace('$', '')) : null,
        quantity: parseInt(row.cells[5].innerText)
    }));
    localStorage.setItem('trades', JSON.stringify(updatedTrades));
}

// Save trade to localStorage
function saveTradeToLocalStorage(symbol, entryDate, entryPrice, exitDate, exitPrice, quantity) {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push({ symbol, entryDate, entryPrice, exitDate, exitPrice, quantity });
    localStorage.setItem('trades', JSON.stringify(trades));
}

// Remove trade from localStorage
function removeTradeFromLocalStorage(row) {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades = trades.filter(trade => trade.symbol !== row.cells[0].innerText || trade.entryDate !== row.cells[1].innerText);
    localStorage.setItem('trades', JSON.stringify(trades));
}
// Other JavaScript functions

function fetchGraphData(symbol, price) {
    const graphEndpoint = 'http://127.0.0.1:5001/generate'; // Graph microservice endpoint

    const stockData = {
        stock1: {
            symbol: symbol,
            price: price,
            peRatio: 0,
            marketCap: 0,
            dividend: 0,
            volume: 0
        },
        stock2: {
            symbol: symbol,
            price: price,
            peRatio: 0,
            marketCap: 0,
            dividend: 0,
            volume: 0
        }
    };

    fetch(graphEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.image) {
            const img = document.getElementById("comparisonGraph");
            img.src = "data:image/png;base64," + data.image;
            document.getElementById('comparisonResult').style.display = 'block';
        } else {
            alert('Failed to generate the graph. No image data returned.');
        }
    })
    .catch(error => {
        console.error('Error fetching graph data:', error);
        alert('Failed to fetch graph data. Please try again later.');
    });
}

function fetchStockData(symbol1, symbol2) {
    const url = "http://127.0.0.1:5003/stockdata";
    const data = {
        symbol1: symbol1,
        symbol2: symbol2
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch stock data. Status code: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Handle and display the data in the UI
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch graph data. Please try again later.');
    });
}
