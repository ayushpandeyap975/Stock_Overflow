import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  Shield,
  Globe,
  Upload,
  AlertTriangle,
  DollarSign,
  Clock,
  FileText,
} from 'lucide-react';

const mockPortfolioData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const mockMarketData = [
  { name: 'Stocks', value: 3200 },
  { name: 'Bonds', value: 2100 },
  { name: 'Crypto', value: 1500 },
  { name: 'Real Estate', value: 2800 },
];

function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [riskPreference, setRiskPreference] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8" />
            <h1 className="text-2xl font-bold">AI Financial Assistant</h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'portfolio'
                  ? 'bg-indigo-700'
                  : 'hover:bg-indigo-700/50'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'market' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
              }`}
            >
              Market Updates
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'tax' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'
              }`}
            >
              Tax Assistant
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className={`px-3 py-2 rounded-lg ${
                activeTab === 'currency'
                  ? 'bg-indigo-700'
                  : 'hover:bg-indigo-700/50'
              }`}
            >
              Currency Manager
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Portfolio Analysis */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Portfolio Performance
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockPortfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4f46e5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Risk Preference
                    </label>
                    <select
                      value={riskPreference}
                      onChange={(e) => setRiskPreference(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select preference</option>
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time Horizon
                    </label>
                    <select
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select time horizon</option>
                      <option value="short">Short Term (0-2 years)</option>
                      <option value="medium">Medium Term (2-5 years)</option>
                      <option value="long">Long Term (5+ years)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-indigo-600" />
                Upload Portfolio
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  className="hidden"
                  id="portfolio-upload"
                  accept=".csv,.xlsx"
                />
                <label
                  htmlFor="portfolio-upload"
                  className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                >
                  Click to upload or drag and drop
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: CSV, XLSX
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Market Updates */}
        {activeTab === 'market' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMarketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2">Latest Updates</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                    <span>Market volatility alert: Tech sector experiencing fluctuations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>S&P 500 reaches new high</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-2">
                    <DollarSign className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <span>Consider increasing bond allocation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <span>Monitor emerging market opportunities</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2">Fraud Prevention</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                    <span>Unusual activity detected in tech investments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>2FA enabled for all transactions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tax Assistant */}
        {activeTab === 'tax' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Tax Planning Assistant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tax Optimization</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-2">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <DollarSign className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Tax Loss Harvesting</p>
                        <p className="text-sm text-gray-600">
                          Potential savings: $2,500
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Retirement Contributions</p>
                        <p className="text-sm text-gray-600">
                          Maximize your 401(k) contributions
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Upcoming Deadlines
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quarterly Estimated Taxes</p>
                        <p className="text-sm text-gray-600">Due in 15 days</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Currency Manager */}
        {activeTab === 'currency' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                Global Currency Manager
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Currency Exchange Rates
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>USD/EUR</span>
                      <span className="font-semibold">0.85</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>USD/GBP</span>
                      <span className="font-semibold">0.73</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>USD/JPY</span>
                      <span className="font-semibold">110.45</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Currency Alerts</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            EUR/USD approaching target rate
                          </p>
                          <p className="text-sm text-yellow-600">
                            Consider executing planned exchanges
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;