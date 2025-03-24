document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const stockSearch = document.getElementById('stockSearch');
    const stockSuggestions = document.getElementById('stockSuggestions');
    const selectedStocks = document.getElementById('selectedStocks');
    const analyzeBtn = document.getElementById('analyzePortfolio');
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const emptyState = document.getElementById('emptyState');
    const portfolioContent = document.getElementById('portfolioContent');
    const performanceTabs = document.querySelectorAll('.performance-tab');
    const totalStocksEl = document.getElementById('totalStocks');
    
    // Sample stock data
    const stockDatabase = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
        { symbol: 'META', name: 'Meta Platforms, Inc.' },
        { symbol: 'TSLA', name: 'Tesla, Inc.' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
        { symbol: 'V', name: 'Visa Inc.' },
        { symbol: 'JNJ', name: 'Johnson & Johnson' }
    ];
    
    // Portfolio data
    let portfolio = [];
    
    // Stock search functionality
    stockSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            stockSuggestions.classList.add('d-none');
            return;
        }
        
        const filteredStocks = stockDatabase.filter(stock => 
            stock.symbol.toLowerCase().includes(query) || 
            stock.name.toLowerCase().includes(query)
        );
        
        if (filteredStocks.length > 0) {
            stockSuggestions.innerHTML = '';
            filteredStocks.forEach(stock => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                `;
                item.addEventListener('click', () => addStockToPortfolio(stock));
                stockSuggestions.appendChild(item);
            });
            stockSuggestions.classList.remove('d-none');
        } else {
            stockSuggestions.classList.add('d-none');
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== stockSearch && !stockSuggestions.contains(e.target)) {
            stockSuggestions.classList.add('d-none');
        }
    });
    
    // Add stock to portfolio
    function addStockToPortfolio(stock) {
        if (!portfolio.some(item => item.symbol === stock.symbol)) {
            portfolio.push(stock);
            updateSelectedStocks();
        }
        stockSearch.value = '';
        stockSuggestions.classList.add('d-none');
    }
    
    // Update selected stocks display
    function updateSelectedStocks() {
        selectedStocks.innerHTML = '';
        portfolio.forEach(stock => {
            const tag = document.createElement('div');
            tag.className = 'stock-tag';
            tag.innerHTML = `
                ${stock.symbol}
                <span class="remove-stock" data-symbol="${stock.symbol}">×</span>
            `;
            selectedStocks.appendChild(tag);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-stock').forEach(btn => {
            btn.addEventListener('click', function() {
                const symbol = this.getAttribute('data-symbol');
                portfolio = portfolio.filter(stock => stock.symbol !== symbol);
                updateSelectedStocks();
            });
        });
    }
    
    // Analyze portfolio
    analyzeBtn.addEventListener('click', function() {
        if (portfolio.length === 0) {
            alert('Please add at least one stock to your portfolio.');
            return;
        }
        
        // Update UI
        emptyState.classList.add('d-none');
        portfolioContent.classList.remove('d-none');
        totalStocksEl.textContent = portfolio.length;
        
        // Initialize chart
        initializeChart();
    });
    
    // File upload handling
    uploadArea.addEventListener('click', function() {
        fileUpload.click();
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'transparent';
        
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });
    
    fileUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });
    
    function handleFile(file) {
        // In a real app, this would parse the file
        // For demo, we'll just add some sample stocks
        portfolio = [
            { symbol: 'AAPL', name: 'Apple Inc.' },
            { symbol: 'MSFT', name: 'Microsoft Corporation' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.' },
            { symbol: 'AMZN', name: 'Amazon.com, Inc.' }
        ];
        
        updateSelectedStocks();
        
        // Update UI
        emptyState.classList.add('d-none');
        portfolioContent.classList.remove('d-none');
        totalStocksEl.textContent = portfolio.length;
        
        // Initialize chart
        initializeChart();
    }
    
    // Performance tabs
    performanceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            performanceTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            updateChart(period);
        });
    });
    
    // Initialize chart
    function initializeChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Sample data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [4000, 3800, 3000, 4800, 2900, 2700, 3500, 3800, 4200, 4500, 4700, 5000];
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(108, 92, 231, 0.5)');
        gradient.addColorStop(1, 'rgba(108, 92, 231, 0.0)');
        
        // Create chart
        window.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio Value',
                    data: data,
                    borderColor: '#6C5CE7',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#6C5CE7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
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
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#333',
                        bodyColor: '#666',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [5, 5],
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update chart based on selected period
    function updateChart(period) {
        if (!window.portfolioChart) return;
        
        let labels, data;
        
        switch(period) {
            case '1m':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [4700, 4800, 4750, 5000];
                break;
            case '3m':
                labels = ['Oct', 'Nov', 'Dec'];
                data = [4500, 4700, 5000];
                break;
            case '6m':
                labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [3500, 3800, 4200, 4500, 4700, 5000];
                break;
            case '1y':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [4000, 3800, 3000, 4800, 2900, 2700, 3500, 3800, 4200, 4500, 4700, 5000];
                break;
            case 'all':
                labels = ['2019', '2020', '2021', '2022', '2023'];
                data = [2500, 3200, 3800, 4200, 5000];
                break;
        }
        
        window.portfolioChart.data.labels = labels;
        window.portfolioChart.data.datasets[0].data = data;
        window.portfolioChart.update();
    }
});
