document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tax-tab');
  const contents = document.querySelectorAll('.tax-content');
  
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Show active content
          const tabId = tab.getAttribute('data-tab');
          contents.forEach(content => {
              content.classList.remove('active');
          });
          document.getElementById(`${tabId}-content`).classList.add('active');
      });
  });

  // Tax calculation
  let taxChartInstance = null;
  const calculateBtn = document.getElementById('calculateBtn');
  const taxResult = document.getElementById('taxResult');
  const totalTaxValue = document.getElementById('totalTaxValue');
  const breakdownList = document.getElementById('breakdownList');
  const printBtn = document.getElementById('printBtn');
  
  calculateBtn.addEventListener('click', calculateTax);
  printBtn.addEventListener('click', printTaxReport);
  
  function calculateTax() {
      // Get input values
      const stcg = parseFloat(document.getElementById('stcg').value) || 0;
      const ltcg = parseFloat(document.getElementById('ltcg').value) || 0;
      const intraday = parseFloat(document.getElementById('intraday').value) || 0;
      const fo = parseFloat(document.getElementById('fo').value) || 0;
      const dividend = parseFloat(document.getElementById('dividend').value) || 0;
      const other = parseFloat(document.getElementById('other').value) || 0;
      
      // Calculate taxes
      const stcgTax = stcg * 0.15;
      const ltcgTax = Math.max(ltcg - 100000, 0) * 0.10;
      const intradayTax = intraday * 0.30;
      const foTax = fo * 0.30;
      const totalTax = stcgTax + ltcgTax + intradayTax + foTax;
      
      // Update UI
      totalTaxValue.textContent = `₹${totalTax.toFixed(2)}`;
      
      // Create breakdown list
      breakdownList.innerHTML = '';
      
      const breakdownItems = [
          { label: 'STCG Tax (15%)', value: stcgTax },
          { label: 'LTCG Tax (10% beyond ₹1L)', value: ltcgTax },
          { label: 'Intraday Tax (30%)', value: intradayTax },
          { label: 'F&O Tax (30%)', value: foTax }
      ];
      
      breakdownItems.forEach(item => {
          const li = document.createElement('li');
          li.className = 'breakdown-item';
          li.innerHTML = `
              <span>${item.label}</span>
              <span>₹${item.value.toFixed(2)}</span>
          `;
          breakdownList.appendChild(li);
      });
      
      // Create/update chart
      createTaxChart([stcgTax, ltcgTax, intradayTax, foTax]);
      
      // Show result
      taxResult.classList.remove('d-none');
      taxResult.scrollIntoView({ behavior: 'smooth' });
  }
  
  function createTaxChart(data) {
      const ctx = document.getElementById('taxChart').getContext('2d');
      
      // Destroy previous chart if exists
      if (taxChartInstance) {
          taxChartInstance.destroy();
      }
      
      // Create new chart
      taxChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ['STCG', 'LTCG', 'Intraday', 'F&O'],
              datasets: [{
                  data: data,
                  backgroundColor: [
                      '#6C5CE7',
                      '#28A745',
                      '#FFC107',
                      '#DC3545'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'right'
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              const label = context.label || '';
                              const value = context.raw;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                          }
                      }
                  }
              }
          }
      });
  }
  
  function printTaxReport() {
      // Add print-visible class to the calculator content
      document.getElementById('calculator-content').classList.add('print-visible');
      
      // Print the page
      window.print();
      
      // Remove print-visible class after printing
      setTimeout(() => {
          document.getElementById('calculator-content').classList.remove('print-visible');
      }, 100);
  }
});