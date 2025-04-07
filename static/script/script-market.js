document.addEventListener('DOMContentLoaded', function () {
    // Fetch real-time news from NewsAPI
    async function fetchNews() {
        const accessKey = 'bf72c4656b00950edbe6484d11ee98fa'; // 🔐 Replace with your Mediastack key
        try {
            const response = await fetch(`http://api.mediastack.com/v1/news?access_key=${accessKey}&categories=business&languages=en&limit=7`);
            const data = await response.json();
    
            if (data.data) {
                populateNews(data.data); // Note: Mediastack uses 'data.data'
            } else {
                console.error('No news articles found:', data);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
        }
    }
    

    // Render fetched news to the DOM
    function populateNews(articles) {
        const newsFeed = document.getElementById('newsFeed');
        newsFeed.innerHTML = '';
    
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
    
            newsItem.innerHTML = `
                <div class="news-title">${article.title}</div>
                <div class="news-meta">
                    <span class="news-source">${article.source || 'Unknown Source'}</span>
                    <span class="news-timestamp">${new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="news-summary">${article.description || 'No summary available.'}</div>
                <div class="news-tags">
                    <span class="news-tag">Live</span>
                </div>
            `;
    
            newsFeed.appendChild(newsItem);
        });
    }
    

    // Call fetchNews on page load
    fetchNews();

    // Optional: auto-refresh news every 60 seconds
    setInterval(fetchNews, 60000);

    // Keep your existing static data for market movers and charts
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

    const moversTabs = document.querySelectorAll('.movers-tab');
    const moversContents = document.querySelectorAll('.movers-content');

    moversTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            moversTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.getAttribute('data-tab');
            moversContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    function initializeSectorChart() {
        const ctx = document.getElementById('sectorChart').getContext('2d');

        const sectors = [
            'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary',
            'Communication Services', 'Industrials', 'Consumer Staples',
            'Energy', 'Utilities', 'Materials', 'Real Estate'
        ];

        const performances = [2.8, 1.5, 0.9, 0.7, 1.2, -0.3, -0.5, -1.2, -0.8, -0.4, -1.5];

        const positiveGradient = ctx.createLinearGradient(0, 0, 0, 400);
        positiveGradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
        positiveGradient.addColorStop(1, 'rgba(40, 167, 69, 0.2)');

        const negativeGradient = ctx.createLinearGradient(0, 0, 0, 400);
        negativeGradient.addColorStop(0, 'rgba(220, 53, 69, 0.8)');
        negativeGradient.addColorStop(1, 'rgba(220, 53, 69, 0.2)');

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
                            label: function (context) {
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
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initializeSectorChart();

    function updateMarketData() {
        const indices = document.querySelectorAll('.index-value');
        const changes = document.querySelectorAll('.index-change');

        indices.forEach((index, i) => {
            let value = parseFloat(index.textContent.replace(',', ''));
            const change = value * (Math.random() * 0.002 - 0.001);
            value += change;

            index.textContent = value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

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

        const sentimentIndicator = document.querySelector('.sentiment-indicator');
        let position = parseFloat(sentimentIndicator.style.left);
        position += (Math.random() * 2 - 1);
        position = Math.max(10, Math.min(90, position));
        sentimentIndicator.style.left = `${position}%`;

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

    setInterval(updateMarketData, 5000);

    document.getElementById('addToWatchlist').addEventListener('click', function () {
        alert('Feature coming soon: Add stocks to your watchlist');
    });
});
