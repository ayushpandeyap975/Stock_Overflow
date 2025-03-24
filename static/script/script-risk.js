document.addEventListener('DOMContentLoaded', function() {
    const riskForm = document.getElementById('riskForm');
    const generateBtn = document.getElementById('generateRecommendations');
    const riskProfileDisplay = document.getElementById('riskProfileDisplay');
    const riskLevelIndicator = document.getElementById('riskLevelIndicator');
    const noRecommendations = document.getElementById('noRecommendations');
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    
    // Sample stock data
    const stockData = {
        conservative: [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: +1.25, sector: 'Technology', risk: 'low' },
            { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.64, change: -0.32, sector: 'Healthcare', risk: 'low' },
            { symbol: 'PG', name: 'Procter & Gamble', price: 162.95, change: +0.87, sector: 'Consumer Staples', risk: 'low' }
        ],
        moderate: [
            { symbol: 'MSFT', name: 'Microsoft Corporation', price: 328.79, change: +2.45, sector: 'Technology', risk: 'medium' },
            { symbol: 'V', name: 'Visa Inc.', price: 267.23, change: +1.12, sector: 'Financial Services', risk: 'medium' },
            { symbol: 'HD', name: 'Home Depot', price: 342.87, change: -1.23, sector: 'Retail', risk: 'medium' }
        ],
        aggressive: [
            { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.48, change: +5.67, sector: 'Automotive', risk: 'high' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 437.53, change: +12.34, sector: 'Technology', risk: 'high' },
            { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 127.74, change: -2.31, sector: 'E-commerce', risk: 'high' }
        ]
    };
    
    // Generate recommendations based on user input
    generateBtn.addEventListener('click', function() {
        const riskPreference = document.getElementById('riskPreference').value;
        const timeHorizon = document.getElementById('timeHorizon').value;
        const investmentAmount = document.getElementById('investmentAmount').value;
        
        if (!riskPreference || !timeHorizon || !investmentAmount) {
            alert('Please complete all fields to generate recommendations.');
            return;
        }
        
        // Update risk profile display
        riskProfileDisplay.classList.remove('d-none');
        noRecommendations.classList.add('d-none');
        recommendationsContainer.classList.remove('d-none');
        
        // Update risk level indicator
        riskLevelIndicator.className = 'risk-level';
        if (riskPreference === 'conservative') {
            riskLevelIndicator.classList.add('risk-conservative');
        } else if (riskPreference === 'moderate') {
            riskLevelIndicator.classList.add('risk-moderate');
        } else {
            riskLevelIndicator.classList.add('risk-aggressive');
        }
        
        // Generate stock recommendations
        generateStockRecommendations(riskPreference, timeHorizon);
    });
    
    // Function to generate stock recommendations
    function generateStockRecommendations(riskPreference, timeHorizon) {
        // Clear previous recommendations
        recommendationsContainer.innerHTML = '';
        
        // Get stocks based on risk preference
        const stocks = stockData[riskPreference];
        
        // Add time horizon factor (in a real app, this would be more sophisticated)
        let filteredStocks = stocks;
        if (timeHorizon === 'short' && riskPreference === 'aggressive') {
            // For short term with aggressive risk, add a moderate option
            filteredStocks = [...stocks, stockData.moderate[0]];
        } else if (timeHorizon === 'long' && riskPreference === 'conservative') {
            // For long term with conservative risk, add a moderate option
            filteredStocks = [...stocks, stockData.moderate[1]];
        }
        
        // Create stock cards
        filteredStocks.forEach(stock => {
            const stockCard = document.createElement('div');
            stockCard.className = 'stock-card';
            
            const riskTagClass = stock.risk === 'low' ? 'tag-low' : 
                                stock.risk === 'medium' ? 'tag-medium' : 'tag-high';
            
            const changeClass = stock.change >= 0 ? 'stock-positive' : 'stock-negative';
            const changeSymbol = stock.change >= 0 ? '+' : '';
            
            stockCard.innerHTML = `
                <div class="stock-info">
                    <div class="stock-name">${stock.symbol} - ${stock.name}</div>
                    <div class="stock-details">
                        <span class="risk-tag ${riskTagClass}">${stock.risk.charAt(0).toUpperCase() + stock.risk.slice(1)} Risk</span>
                        <span>${stock.sector}</span>
                    </div>
                </div>
                <div class="text-end">
                    <div class="stock-price">$${stock.price.toFixed(2)}</div>
                    <div class="stock-change ${changeClass}">${changeSymbol}${stock.change.toFixed(2)}%</div>
                </div>
            `;
            
            recommendationsContainer.appendChild(stockCard);
        });
    }
});
