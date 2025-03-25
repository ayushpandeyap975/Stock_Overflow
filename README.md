# StockOverflow

StockOverflow is a comprehensive stock management platform built on Django, designed to provide real-time market updates, portfolio management, currency conversion, and an intelligent chatbot named StockEye. StockEye, powered by Google Cloud Vertex AI, integrates risk assessment and tax calculation features to offer users a seamless and intelligent financial assistant.

## Features

- **StockEye Chatbot:** Powered by Google Cloud Vertex AI, the chatbot provides personalized support, including risk assessment and tax calculation, guiding users in their investment journey.
- **Portfolio Analysis:** Analyze the performance of stocks in your portfolio and track progress (`stock_portfolio`).
- **Market Updates:** Get real-time updates on market trends, including top gainers, losers, and sector-wise analysis (`stock_market`).
- **Currency Converter:** Convert international currencies effortlessly with real-time rates (`stock_currency`).
- **User Accounts:** Secure login and registration for personalized experiences (`stock_accounts`).

## File Structure

```
├── .venv/          # Virtual environment for managing dependencies
├── static/         # Static files for styling and interactivity
├── stock_accounts/ # Handles user authentication and account management
├── stock_currency/ # Currency exchange and conversion logic
├── stock_market/   # Real-time market data and analysis
├── stock_portfolio/ # Portfolio management and stock analysis
├── stockeye/       # Chatbot implementation with risk assessment and tax calculations
├── stockoverflow/  # Django project settings and configurations
├── templates/      # Global HTML templates
├── db.sqlite3      # SQLite database file
├── manage.py       # Django management script
└── README.md       # Project documentation
```


## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/StockOverflow.git

2. **Navigate to the project directory:**
   ```bash
   cd StockOverflow
   ```

3. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

4. **Activate the virtual environment:**
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

5. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

8. **Access the platform:**
   Open your browser and navigate to `http://127.0.0.1:8000` to start using StockOverflow.

## Chatbot Integration: StockEye

StockEye is an intelligent chatbot powered by Google Cloud Vertex AI. It integrates the following functionalities:
- **Risk Assessment:** Offers insights into optimal investments based on user risk preferences.
- **Tax Calculator:** Simplifies tax calculations related to stock transactions.
- **Personalized Assistance:** Provides quick responses to user queries about stocks, markets, and more.

### Setting Up the Chatbot:
1. Set up your Google Cloud Vertex AI account and enable the API.
2. Configure API credentials and add them to your environment variables.
3. Update the chatbot logic in `stockeye/views.py` to integrate the Vertex AI API.

## Contributors

- **Krish Sandhu**
- **Arnav Bhardwaj**
- **Ayush Pandey**
- **Shreya Yadav**

