/**
 * US Indices Predictor - Core Logic
 * Handles data, predictions, and visualization.
 */

const HISTORICAL_DATA = {
  years: Array.from({ length: 47 }, (_, i) => 1980 + i), // Up to 2026
  sp500: [
    135.76, 122.55, 140.64, 164.93, 167.24, 211.28, 242.17, 247.08, 277.72, 353.40,
    330.22, 417.09, 435.71, 466.45, 459.27, 615.93, 740.74, 970.43, 1229.23, 1469.25,
    1320.28, 1148.08, 879.82, 1111.92, 1211.92, 1248.29, 1418.30, 1468.36, 903.25, 1115.10,
    1257.64, 1257.60, 1426.19, 1848.36, 2058.90, 2043.94, 2238.83, 2673.61, 2506.85, 3230.78,
    3756.07, 4766.18, 3839.50, 4769.83, 5200.12, 5800.45, 6120.30 // 2024, 2025, May 2026
  ],
  nasdaq: [
    202.34, 195.84, 232.41, 278.69, 247.35, 324.93, 348.83, 330.47, 381.38, 454.82,
    373.84, 586.34, 676.95, 776.80, 751.96, 1052.13, 1291.03, 1570.35, 2192.69, 4069.31,
    2470.52, 1950.40, 1335.51, 2003.37, 2175.44, 2205.32, 2415.29, 2652.28, 1577.01, 2269.15,
    2652.87, 2605.15, 3019.51, 4176.59, 4736.05, 5007.41, 5383.12, 6903.39, 6635.28, 8972.60,
    12888.28, 15644.97, 10466.48, 15011.35, 18100.40, 20500.60, 21800.15 // 2024, 2025, May 2026
  ],
  djia: [
    963.99, 875.00, 1046.54, 1258.64, 1211.57, 1546.67, 1895.95, 1938.83, 2168.57, 2753.20,
    2633.66, 3168.83, 3301.11, 3754.09, 3834.44, 5117.12, 6448.27, 7908.25, 9181.43, 11497.12,
    10786.85, 10021.50, 8341.63, 10453.92, 10783.01, 10717.50, 12463.15, 13264.82, 8776.39, 10428.05,
    11577.51, 12217.56, 13104.14, 16576.66, 17823.07, 17425.03, 19762.60, 24719.22, 23327.46, 28538.44,
    30606.48, 36338.30, 33147.25, 37689.54, 40000.12, 42500.80, 44200.50 // 2024, 2025, May 2026
  ]
};

class PredictionEngine {
  /**
   * Calculates Compound Annual Growth Rate
   */
  static calculateCAGR(startValue, endValue, years) {
    return Math.pow(endValue / startValue, 1 / years) - 1;
  }

  /**
   * Converts Annual CAGR to Monthly Growth Rate
   */
  static annualToMonthlyRate(annualRate) {
    return Math.pow(1 + annualRate, 1 / 12) - 1;
  }

  /**
   * Projects future values monthly based on monthly rate
   */
  static projectMonthly(currentValue, monthlyRate, months) {
    const projections = [];
    for (let i = 1; i <= months; i++) {
      projections.push(currentValue * Math.pow(1 + monthlyRate, i));
    }
    return projections;
  }
}

class MarketUI {
  constructor() {
    this.chart = null;
    this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
    this.updateMetricCards();
    this.initChart();
  }

  setupEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('prediction-years').addEventListener('change', () => this.updateChart());
    document.getElementById('base-period').addEventListener('change', () => {
      this.updateMetricCards();
      this.updateChart();
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    this.updateChart(); // Refresh chart colors
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  updateMetricCards() {
    const indices = ['sp500', 'nasdaq', 'djia'];
    const basePeriod = document.getElementById('base-period').value;
    
    indices.forEach(id => {
      const data = HISTORICAL_DATA[id];
      const current = data[data.length - 1];
      
      let startValue, yearsCount, labelSuffix;
      
      if (basePeriod === 'all') {
        startValue = data[0];
        yearsCount = HISTORICAL_DATA.years.length - 1;
        labelSuffix = 'All-Time';
      } else {
        const windowSize = parseInt(basePeriod);
        startValue = data[data.length - 1 - windowSize];
        yearsCount = windowSize;
        labelSuffix = `Last ${windowSize}Y`;
      }

      const totalGrowth = ((current - startValue) / startValue * 100).toFixed(0);
      const cagr = (PredictionEngine.calculateCAGR(startValue, current, yearsCount) * 100).toFixed(1);

      const card = document.querySelector(`.stat-card[data-index="${id}"]`);
      if (card) {
        card.querySelector('.price').textContent = current.toLocaleString(undefined, { maximumFractionDigits: 0 });
        card.querySelector('.growth').textContent = `${totalGrowth > 0 ? '+' : ''}${totalGrowth}% (${labelSuffix} Avg: ${cagr}%/Yr)`;
      }
    });
  }

  initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    
    // Define colors based on theme
    const isDark = this.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#f8fafc' : '#1e293b';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { 
              color: textColor,
              maxTicksLimit: 12, // Limit labels to keep it clean
              maxRotation: 0
            }
          },
          y: {
            type: 'linear', // Changed from logarithmic to show the exponential curve
            grid: { color: gridColor },
            ticks: { 
              color: textColor,
              callback: (value) => value.toLocaleString()
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, usePointStyle: true, padding: 20 }
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#1e293b',
            bodyColor: isDark ? '#cbd5e1' : '#475569',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  getChartData() {
    const projectionYears = parseInt(document.getElementById('prediction-years').value);
    const basePeriod = document.getElementById('base-period').value;
    const labels = [...HISTORICAL_DATA.years.map(String)];
    const lastYear = HISTORICAL_DATA.years[HISTORICAL_DATA.years.length - 1];
    
    // Monthly labels for projection
    if (projectionYears > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let y = 1; y <= projectionYears; y++) {
        for (let m = 0; m < 12; m++) {
          labels.push(`${months[m]} ${lastYear + y}`);
        }
      }
    }

    const datasets = [
      { id: 'sp500', label: 'S&P 500', color: '#6366f1' },
      { id: 'nasdaq', label: 'NASDAQ', color: '#10b981' },
      { id: 'djia', label: 'DJIA', color: '#f59e0b' }
    ];

    return {
      labels: labels,
      datasets: datasets.map(ds => {
        const historical = HISTORICAL_DATA[ds.id];
        const current = historical[historical.length - 1];
        
        let startValue, yearsCount;
        if (basePeriod === 'all') {
          startValue = historical[0];
          yearsCount = HISTORICAL_DATA.years.length - 1;
        } else {
          const windowSize = parseInt(basePeriod);
          startValue = historical[historical.length - 1 - windowSize];
          yearsCount = windowSize;
        }

        const annualCagr = PredictionEngine.calculateCAGR(startValue, current, yearsCount);
        const monthlyRate = PredictionEngine.annualToMonthlyRate(annualCagr);
        
        const projections = projectionYears > 0 
          ? PredictionEngine.projectMonthly(current, monthlyRate, projectionYears * 12) 
          : [];
        
        return {
          label: ds.label,
          data: [...historical, ...projections],
          borderColor: ds.color,
          backgroundColor: ds.color + '10',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: ds.color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          fill: true,
          tension: 0.1,
          segment: {
            borderDash: ctx => ctx.p0DataIndex >= HISTORICAL_DATA.years.length - 1 ? [5, 5] : undefined,
          }
        };
      })
    };
  }

  updateChart() {
    if (!this.chart) return;
    
    const isDark = this.theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#1e293b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    this.chart.data = this.getChartData();
    this.chart.options.scales.x.ticks.color = textColor;
    this.chart.options.scales.y.ticks.color = textColor;
    this.chart.options.scales.y.grid.color = gridColor;
    this.chart.options.plugins.legend.labels.color = textColor;
    this.chart.options.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#ffffff';
    this.chart.options.plugins.tooltip.titleColor = isDark ? '#ffffff' : '#1e293b';

    this.chart.update();
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new MarketUI();
});
