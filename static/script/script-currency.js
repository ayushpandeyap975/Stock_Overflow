document.addEventListener('DOMContentLoaded', function() {
    // Currency data
    const currencies = [
        { code: 'USD', name: 'US Dollar', flag: 'us', symbol: '$' },
        { code: 'EUR', name: 'Euro', flag: 'eu', symbol: '€' },
        { code: 'GBP', name: 'British Pound', flag: 'gb', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', flag: 'jp', symbol: '¥' },
        { code: 'CAD', name: 'Canadian Dollar', flag: 'ca', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', flag: 'au', symbol: 'A$' },
        { code: 'CHF', name: 'Swiss Franc', flag: 'ch', symbol: 'Fr' },
        { code: 'CNY', name: 'Chinese Yuan', flag: 'cn', symbol: '¥' },
        { code: 'INR', name: 'Indian Rupee', flag: 'in', symbol: '₹' },
        { code: 'BRL', name: 'Brazilian Real', flag: 'br', symbol: 'R$' }
    ];

    // Exchange rates (relative to USD)
const exchangeRates = {
    'USD': 1.00,
    'EUR': 0.92,
    'GBP': 0.77,
    'JPY': 149.80,
    'CAD': 1.43,
    'AUD': 1.59,
    'CHF': 0.88,
    'CNY': 7.25,
    'INR': 85.60,
    'BRL': 5.70
};

    // Elements
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromCurrencyDropdown = document.getElementById('fromCurrencyDropdown');
    const toCurrencyDropdown = document.getElementById('toCurrencyDropdown');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const swapCurrencies = document.getElementById('swapCurrencies');
    const conversionResult = document.getElementById('conversionResult');
    const conversionExplanation = document.getElementById('conversionExplanation');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Populate currency dropdowns
    function populateCurrencyDropdowns() {
        currencies.forEach(currency => {
            // From currency dropdown
            const fromOption = document.createElement('div');
            fromOption.className = 'currency-option';
            fromOption.innerHTML = `
                <img src="https://flagcdn.com/w40/${currency.flag}.png" alt="${currency.code}" class="currency-flag">
                <div>
                    <div class="currency-code">${currency.code}</div>
                    <div class="currency-name">${currency.name}</div>
                </div>
            `;
            fromOption.addEventListener('click', () => {
                selectCurrency('from', currency);
            });
            fromCurrencyDropdown.appendChild(fromOption);

            // To currency dropdown
            const toOption = fromOption.cloneNode(true);
            toOption.addEventListener('click', () => {
                selectCurrency('to', currency);
            });
            toCurrencyDropdown.appendChild(toOption);
        });
    }

    // Select currency
    function selectCurrency(type, currency) {
        const element = type === 'from' ? fromCurrency : toCurrency;
        element.innerHTML = `
            <img src="https://flagcdn.com/w40/${currency.flag}.png" alt="${currency.code}" class="currency-flag">
            <span class="currency-code">${currency.code}</span>
        `;
        element.dataset.code = currency.code;
        
        // Hide dropdown
        if (type === 'from') {
            fromCurrencyDropdown.style.display = 'none';
        } else {
            toCurrencyDropdown.style.display = 'none';
        }
        
        // Update conversion
        updateConversion();
    }

    // Toggle currency dropdown
    fromCurrency.addEventListener('click', () => {
        fromCurrencyDropdown.style.display = fromCurrencyDropdown.style.display === 'block' ? 'none' : 'block';
        toCurrencyDropdown.style.display = 'none';
    });

    toCurrency.addEventListener('click', () => {
        toCurrencyDropdown.style.display = toCurrencyDropdown.style.display === 'block' ? 'none' : 'block';
        fromCurrencyDropdown.style.display = 'none';
    });

    // Hide dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!fromCurrency.contains(e.target) && !fromCurrencyDropdown.contains(e.target)) {
            fromCurrencyDropdown.style.display = 'none';
        }
        if (!toCurrency.contains(e.target) && !toCurrencyDropdown.contains(e.target)) {
            toCurrencyDropdown.style.display = 'none';
        }
    });

    // Update conversion
    function updateConversion() {
        const fromCode = fromCurrency.dataset.code || 'USD';
        const toCode = toCurrency.dataset.code || 'EUR';
        const amount = parseFloat(fromAmount.value) || 0;
        
        // Calculate conversion
        const rate = exchangeRates[toCode] / exchangeRates[fromCode];
        const result = amount * rate;
        
        // Update UI
        toAmount.value = result.toFixed(2);
        conversionResult.textContent = `${result.toFixed(2)} ${toCode}`;
        conversionExplanation.textContent = `1 ${fromCode} = ${rate.toFixed(2)} ${toCode}`;
        
        // Update chart
        updateChart(fromCode, toCode);
    }

    // Swap currencies
    swapCurrencies.addEventListener('click', () => {
        const tempCode = fromCurrency.dataset.code || 'USD';
        const tempFlag = fromCurrency.querySelector('img').src;
        
        // Swap from currency
        fromCurrency.dataset.code = toCurrency.dataset.code || 'EUR';
        fromCurrency.querySelector('img').src = toCurrency.querySelector('img').src;
        fromCurrency.querySelector('.currency-code').textContent = toCurrency.dataset.code || 'EUR';
        
        // Swap to currency
        toCurrency.dataset.code = tempCode;
        toCurrency.querySelector('img').src = tempFlag;
        toCurrency.querySelector('.currency-code').textContent = tempCode;
        
        // Update conversion
        updateConversion();
    });

    // Amount input event
    fromAmount.addEventListener('input', updateConversion);

    // Initialize chart
    function initializeChart() {
        const ctx = document.getElementById('rateHistoryChart').getContext('2d');
        
        // Sample data - 30 days
        const labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        });
        
        // Create chart
        window.rateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Exchange Rate',
                    data: generateRandomRates(0.85, 0.05, 30),
                    borderColor: '#6C5CE7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [5, 5]
                        },
                        ticks: {
                            precision: 3
                        }
                    }
                }
            }
        });
    }

    // Generate random rates for demo
    function generateRandomRates(base, variance, count) {
        return Array.from({length: count}, () => {
            return base + (Math.random() * variance * 2 - variance);
        });
    }

    // Update chart with new currency pair
    function updateChart(fromCode, toCode) {
        if (!window.rateChart) return;
        
        const baseRate = exchangeRates[toCode] / exchangeRates[fromCode];
        const newData = generateRandomRates(baseRate, baseRate * 0.05, 30);
        
        window.rateChart.data.datasets[0].data = newData;
        window.rateChart.data.datasets[0].label = `${fromCode}/${toCode} Exchange Rate`;
        window.rateChart.update();
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show active content
            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Initialize
    populateCurrencyDropdowns();
    initializeChart();
    updateConversion();

    // Set initial currency codes
    fromCurrency.dataset.code = 'USD';
    toCurrency.dataset.code = 'EUR';
});
