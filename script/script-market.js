document.addEventListener('DOMContentLoaded', function() {
    // Sample news data
    const newsData = [
        {
            title: "Fed Signals Potential Rate Cut in September Meeting",
            source: "Financial Times",
            timestamp: "10 minutes ago",
            summary: "Federal Reserve officials indicated they may be ready to cut interest rates at their next meeting, citing improving inflation data and concerns about labor market cooling.",
            tags: ["Federal Reserve", "Interest Rates", "Economy"]
        },
        {
            title: "Tech Stocks Rally as Inflation Fears Ease",
            source: "Wall Street Journal",
            timestamp: "32 minutes ago",
            summary: "Technology shares led a broad market rally after new data showed inflation moderating, potentially easing pressure on the Federal Reserve to maintain high interest rates.",
            tags: ["Tech Stocks", "Inflation", "Market Rally"]
        },
        {
            title: "Oil Prices Drop on Increased Supply Forecasts",
            source: "Bloomberg",
            timestamp: "1 hour ago",
            summary: "Crude oil prices fell more than 2% after OPEC raised its forecast for non-OPEC supply growth, suggesting a potential oversupply in global markets.",
            tags: ["Oil", "OPEC", "Commodities"]
        },
        {
            title: "Retail Sales Beat Expectations in July",
            source: "CNBC",
            timestamp: "2 hours ago",
            summary: "U.S. retail sales rose 0.4% in July, exceeding economists' expectations of 0.2%, suggesting consumer spending remains resilient despite inflation pressures.",
            tags: ["Retail", "Economy", "Consumer Spending"]
        },
        {
            title: "Major Chipmaker Announces $20 Billion Factory Expansion",
            source: "Reuters",
            timestamp: "3 hours ago",
            summary: "A leading semiconductor manufacturer announced plans to invest $20 billion in new production facilities, citing strong demand for AI chips and government incentives.",
            tags: ["Semiconductors", "Manufacturing", "AI"]
        },
        {
            title: "Housing Starts Fall to Two-Year Low",
            source: "MarketWatch",
            timestamp: "4 hours ago",
            summary: "New home construction dropped to its lowest level in two years as high mortgage rates continue to pressure the housing market, according to Commerce Department data.",
            tags: ["Housing", "Construction", "Mortgage Rates"]
        },
        {
            title: "European Markets Close Higher on Banking Strength",
            source: "Financial Times",
            timestamp: "5 hours ago",
            summary: "European stock indices finished higher, led by banking stocks after several major institutions reported better-than-expected quarterly earnings.",
            tags: ["Europe", "Banking", "Earnings"]
        }
    ];

    // Sample market movers data
    const gainersData = [
        { symbol: "NVDA", name: "NVIDIA Corporation", price: 437.53, change: 12.34 },
        { symbol: "TSLA", name: "Tesla, Inc.", price: 248.48, change: 5.67 },
        { symbol: "AMD", name: "Advanced Micro Devices, Inc.", price: 112.45, change: 4.89 },
        { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 3.25 },
        { symbol: "MSFT", name: "Microsoft Corporation", price: 328.79, change: 2.45 }
    ];

    const losersData = [
        { symbol: "PFE", name: "Pfizer Inc.", price: 34.21, change: -3.45 },
        { symbol: "KO", name: "The Coca-Cola Company", price: 58.76, change: -2.87 },
        { symbol: "WMT", name: "Walmart Inc.", price: 142.34, change: -2.31 },
        { symbol: "AMZN", name: "Amazon.com, Inc.", price: 127.74, change: -2.31 },
        { symbol: "JNJ", name: "Johnson & Johnson", price: 152.64, change: -1.98 }
    ];

    const volumeData = [
        { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 3.25, volume: "87.5M" },
        { symbol: "AMD", name: "Advanced Micro Devices, Inc.", price: 112.45, change: 4.89, volume: "76.2M" },
        { symbol: "TSLA", name: "Tesla, Inc.", price: 248.48, change: 5.67, volume: "65.8M" },
        { symbol: "MSFT", name: "Microsoft Corporation", price: 328.79, change: 2.45, volume: "45.3M" },
        { symbol: "AMZN", name: "Amazon.com, Inc.", price: 127.74, change: -2.31, volume: "42.1M" }
    ];

    // Populate news feed
    const newsFeed = document.getElementById('newsFeed');
    
    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        let tagsHTML = '';
        news.tags.forEach(tag => {
            tagsHTML += `<span class="news-tag">${tag}</span>`;
        });
        
        newsItem.innerHTML = `
            <div class="news-title">${news.title}</div>
            <div class="news-meta">
                <span class="news-source">${news.source}</span>
                <span class="news-timestamp">${news.timestamp}</span>
            </div>
            <div class="news-summary">${news.summary}</div>
            <div class="news-tags">
                ${tagsHTML}
            </div>
        `;
        
        newsFeed.appendChild(newsItem);
    });

    // Populate market movers
    function populateMovers(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        data.forEach(item => {
            const moverCard = document.createElement('div');
            moverCard.className = 'mover-card';
            
            const changeClass = item.change >= 0 ? 'change-up' : 'change-down';
            const changeSymbol = item.change >= 0 ? '+' : '';
            
            moverCard.innerHTML = `
                <div class="mover-info">
                    <div class="mover-symbol">${item.symbol}</div>
                    <div class="mover-name">${item.name}</div>
                    <div class="mover-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="mover-change ${changeClass}">
                    ${changeSymbol}${item.change.toFixed(2)}%
                </div>
            `;
            
            container.appendChild(moverCard);
        });
    }
    
    populateMovers(gainersData, 'gainersList');
    populateMovers(losersData, 'losersList');
    populateMovers(volumeData, 'volumeList');

    // Tab switching for movers
    const moversTabs = document.querySelectorAll('.movers-tab');
    const moversContents = document.querySelectorAll('.movers-content');
    
    moversTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            moversTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show active content
            const tabId = tab.getAttribute('data-tab');
            moversContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Initialize sector performance chart
    function initializeSectorChart() {
        const ctx = document.getElementById('sectorChart').getContext('2d');
        
        // Sample sector data
        const sectors = [
            'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 
            'Communication Services', 'Industrials', 'Consumer Staples', 
            'Energy', 'Utilities', 'Materials', 'Real Estate'
        ];
        
        const performances = [2.8, 1.5, 0.9, 0.7, 1.2, -0.3, -0.5, -1.2, -0.8, -0.4, -1.5];
        
        // Create gradient for bars
        const positiveGradient = ctx.createLinearGradient(0, 0, 0, 400);
        positiveGradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
        positiveGradient.addColorStop(1, 'rgba(40, 167, 69, 0.2)');
        
        const negativeGradient = ctx.createLinearGradient(0, 0, 0, 400);
        negativeGradient.addColorStop(0, 'rgba(220, 53, 69, 0.8)');
        negativeGradient.addColorStop(1, 'rgba(220, 53, 69, 0.2)');
        
        // Create chart
        window.sectorChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectors,
                datasets: [{
                    label: 'Daily Performance (%)',
                    data: performances,
                    backgroundColor: performances.map(value => value >= 0 ? positiveGradient : negativeGradient),
                    borderColor: performances.map(value => value >= 0 ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)'),
                    borderWidth: 1
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
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                return value >= 0 ? `+${value}%` : `${value}%`;
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
                            borderDash: [5, 5]
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initialize charts
    initializeSectorChart();
    
    // Auto-update market data
    function updateMarketData() {
        // Simulate real-time updates by slightly changing index values
        const indices = document.querySelectorAll('.index-value');
        const changes = document.querySelectorAll('.index-change');
        
        indices.forEach((index, i) => {
            // Get current value
            let value = parseFloat(index.textContent.replace(',', ''));
            
            // Random small change (-0.1% to +0.1%)
            const change = value * (Math.random() * 0.002 - 0.001);
            value += change;
            
            // Update display
            index.textContent = value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            // Update change percentage
            const changeEl = changes[i];
            let changeValue = parseFloat(changeEl.textContent.replace('%', '').replace('+', ''));
            
            if (change > 0) {
                changeValue += 0.01;
                changeEl.classList.remove('change-down');
                changeEl.classList.add('change-up');
                changeEl.textContent = `+${changeValue.toFixed(2)}%`;
            } else {
                changeValue -= 0.01;
                if (changeValue < 0) {
                    changeEl.classList.remove('change-up');
                    changeEl.classList.add('change-down');
                    changeEl.textContent = `${changeValue.toFixed(2)}%`;
                } else {
                    changeEl.textContent = `+${changeValue.toFixed(2)}%`;
                }
            }
        });
        
        // Update sentiment indicator position
        const sentimentIndicator = document.querySelector('.sentiment-indicator');
        let position = parseFloat(sentimentIndicator.style.left);
        position += (Math.random() * 2 - 1);
        
        // Keep within bounds (10% to 90%)
        position = Math.max(10, Math.min(90, position));
        sentimentIndicator.style.left = `${position}%`;
        
        // Update sentiment reading
        const sentimentReading = document.querySelector('.sentiment-reading');
        if (position < 30) {
            sentimentReading.textContent = 'Bearish';
        } else if (position < 45) {
            sentimentReading.textContent = 'Neutral-Bearish';
        } else if (position < 55) {
            sentimentReading.textContent = 'Neutral';
        } else if (position < 70) {
            sentimentReading.textContent = 'Neutral-Bullish';
        } else {
            sentimentReading.textContent = 'Bullish';
        }
    }
    
    // Update every 5 seconds
    setInterval(updateMarketData, 5000);
    
    // Add to watchlist functionality
    document.getElementById('addToWatchlist').addEventListener('click', function() {
        alert('Feature coming soon: Add stocks to your watchlist');
    });
});
