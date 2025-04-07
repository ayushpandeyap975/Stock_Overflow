document.addEventListener('DOMContentLoaded', function () {
    // Fetch real-time news from NewsAPI
    async function fetchNews() {
        const accessKey = 'bf72c4656b00950edbe6484d11ee98fa'; 
        try {
            const response = await fetch(`http://api.mediastack.com/v1/news?access_key=${accessKey}&categories=business&languages=en&limit=7`);
            const data = await response.json();
    
            if (data.data) {
                populateNews(data.data); 
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
            `;
    
            newsFeed.appendChild(newsItem);
        });
    }
    

    // Call fetchNews on page load
    fetchNews();

    // Optional: auto-refresh news every 60 seconds
    setInterval(fetchNews, 60000);

    const API_KEY = 'RVodTpYUL3zSyS1WxOKKSAkad0KDTdqj';  // Replace this with your actual key
    const BASE_URL = 'https://financialmodelingprep.com/api/v3';

    async function fetchMovers(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}?apikey=${API_KEY}`);
            const data = await response.json();
            return data.slice(0, 5);
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [{
                symbol: 'N/A',
                companyName: 'Failed to load data',
                price: 0,
                change: 0
            }];
        }
    }
    

    function populateMovers(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        data.forEach(item => {
            const moverCard = document.createElement('div');
            moverCard.className = 'mover-card';

            const change = item.changesPercentage ?? item.change;
            const changeVal = typeof change === 'string' ? parseFloat(change.replace('%', '')) : change;
            const changeClass = changeVal >= 0 ? 'change-up' : 'change-down';
            const changeSymbol = changeVal >= 0 ? '+' : '';

            moverCard.innerHTML = `
                <div class="mover-info">
                    <div class="mover-symbol">${item.ticker || item.symbol}</div>
                    <div class="mover-name">${item.companyName || item.name}</div>
                    <div class="mover-price">$${item.price?.toFixed(2) || '-'}</div>
                </div>
                <div class="mover-change ${changeClass}">
                    ${changeSymbol}${changeVal.toFixed(2)}%
                </div>
            `;

            container.appendChild(moverCard);
        });
    }

    function toggleLoader(show, id) {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? 'block' : 'none';
    }
    
    async function loadTopMovers() {
        // Show loading messages
        toggleLoader(true, 'gainersLoading');
        toggleLoader(true, 'losersLoading');
        toggleLoader(true, 'volumeLoading');
    
        const [gainers, losers, actives] = await Promise.all([
            fetchMovers('stock_market/gainers'),
            fetchMovers('stock_market/losers'),
            fetchMovers('stock_market/actives')
        ]);
    
        // Hide loading messages
        toggleLoader(false, 'gainersLoading');
        toggleLoader(false, 'losersLoading');
        toggleLoader(false, 'volumeLoading');
    
        // Populate data
        populateMovers(gainers, 'gainersList');
        populateMovers(losers, 'losersList');
        populateMovers(actives, 'volumeList');
    }    

    loadTopMovers();

    const moversTabs = document.querySelectorAll('.movers-tab');
    const moversContents = document.querySelectorAll('.movers-content');

    moversTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            moversTabs.forEach(t => t.classList.remove('active'));
            moversContents.forEach(c => c.classList.remove('active'));

            // Add active class to selected tab
            tab.classList.add('active');

            // Show the corresponding content
            const tabId = tab.getAttribute('data-tab');
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
