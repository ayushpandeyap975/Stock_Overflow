let currentStockIndex = 0;
const stocks = document.querySelectorAll('.stock-card');

// Function to show a specific stock
function showStock(index) {
    stocks.forEach((stock, i) => {
        stock.style.display = i === index ? "block" : "none";
    });
}

// Function to move to next stock
function nextStock() {
    currentStockIndex = (currentStockIndex + 1) % stocks.length;
    showStock(currentStockIndex);
}

// Function to move to previous stock
function prevStock() {
    currentStockIndex = (currentStockIndex - 1 + stocks.length) % stocks.length;
    showStock(currentStockIndex);
}

// Show the first stock on page load
showStock(currentStockIndex);

// Calculate percentage change from current price
function calculatePercentage() {
    let lastPrice = parseFloat(document.querySelector('.stat-value').textContent.replace('$', ''));
    let targetPrice = parseFloat(document.getElementById('targetPrice').value);

    if (isNaN(targetPrice)) {
        document.getElementById('percentageResult').textContent = "Enter a valid target price!";
        return;
    }

    let change = ((targetPrice - lastPrice) / lastPrice) * 100;
    document.getElementById('percentageResult').textContent = `Change: ${change.toFixed(2)}%`;
}

// Calculate future investment value
function calculateFutureValue() {
    let investment = parseFloat(document.getElementById('investmentAmount').value);
    let predictedPrice = parseFloat(document.querySelector('.stat-value').textContent.replace('$', ''));

    if (isNaN(investment)) {
        document.getElementById('investmentResult').textContent = "Enter a valid investment amount!";
        return;
    }

    let futureValue = (investment / predictedPrice) * predictedPrice;
    document.getElementById('investmentResult').textContent = `Future Value: $${futureValue.toFixed(2)}`;
}


function toggleStockOptions() {
    var market = document.getElementById("market").value;
    var usStocks = document.getElementById("us-stocks");
    var indiaStocks = document.getElementById("india-stocks");

    if (market === "us") {
        usStocks.style.display = "block";
        indiaStocks.style.display = "none";
    } else if (market === "india") {
        usStocks.style.display = "none";
        indiaStocks.style.display = "block";
    } else {
        usStocks.style.display = "none";
        indiaStocks.style.display = "none";
    }
}

function setStockName() {
    var market = document.getElementById("market").value;
    var selectedStock = market === "us" ? document.getElementById("us-stock").value
        : document.getElementById("india-stock").value;

    document.getElementById("selected-symbol").value = selectedStock;
}
function toggleStockOptions() {
    var market = document.getElementById("market").value;
    var usStocks = document.getElementById("us-stocks");
    var indiaStocks = document.getElementById("india-stocks");

    if (market === "us") {
        usStocks.style.display = "block";
        indiaStocks.style.display = "none";
    } else if (market === "india") {
        indiaStocks.style.display = "block";
        usStocks.style.display = "none";
    } else {
        usStocks.style.display = "none";
        indiaStocks.style.display = "none";
    }
}