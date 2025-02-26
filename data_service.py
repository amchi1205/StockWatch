import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)

CORS(app)

# Finnhub API key (replace with your actual API key)
FINNHUB_API_KEY = 'csoc6bhr01qt3r34997gcsoc6bhr01qt3r349980'
# Alpha Vantage API key (replace with your actual API key)
ALPHA_VANTAGE_API_KEY = '9SOCGPML1JZ9MY'

# Helper function to fetch stock data from Finnhub
def fetch_finnhub_stock_data(symbol):
    print(f"Fetching Finnhub stock data for symbol: {symbol}")
    url = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}'
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Error fetching data from Finnhub for {symbol}. Status code: {response.status_code}")
        return None  # Return None if the API request failed

    data = response.json()
    print(f"Received Finnhub data for {symbol}: {data}")
    return data

# Helper function to fetch stock data from Alpha Vantage (Overview function)
def fetch_alpha_vantage_data(symbol):
    print(f"Fetching Alpha Vantage stock data for symbol: {symbol}")
    url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}'
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Error fetching data from Alpha Vantage for {symbol}. Status code: {response.status_code}")
        return None  # Return None if the API request failed

    data = response.json()
    print(f"Received Alpha Vantage data for {symbol}: {data}")
    return data

@app.route('/stockdata', methods=['POST'])
def stock_data():
    print("Received request to fetch stock data.")
    data = request.get_json()
    print(f"Received data: {data}")
    
    symbol1 = data['symbol1']
    symbol2 = data['symbol2']
    
    print(f"Fetching data for {symbol1} and {symbol2}.")

    # Fetch data from Finnhub
    stock1_finnhub_data = fetch_finnhub_stock_data(symbol1)
    stock2_finnhub_data = fetch_finnhub_stock_data(symbol2)

    if not stock1_finnhub_data or not stock2_finnhub_data:
        print("Failed to fetch stock data from Finnhub.")
        return jsonify({'error': 'Failed to fetch stock data from Finnhub'}), 400

    # Fetch data from Alpha Vantage
    stock1_alpha_vantage_data = fetch_alpha_vantage_data(symbol1)
    stock2_alpha_vantage_data = fetch_alpha_vantage_data(symbol2)

    if not stock1_alpha_vantage_data or not stock2_alpha_vantage_data:
        print("Failed to fetch stock data from Alpha Vantage.")
        return jsonify({'error': 'Failed to fetch stock data from Alpha Vantage'}), 400

    print(f"Successfully fetched data for {symbol1} and {symbol2}. Formatting response.")

    # Format the response with both Finnhub and Alpha Vantage data
    return jsonify({
        'stock1': {
            'symbol': symbol1,
            'price': stock1_finnhub_data['c'],  # Current price from Finnhub
            'high': stock1_finnhub_data['h'],   # 52-week high from Finnhub
            'low': stock1_finnhub_data['l'],    # 52-week low from Finnhub
            'pe_ratio': stock1_alpha_vantage_data.get('PERatio', 'N/A'),  # P/E ratio from Alpha Vantage
            'market_cap': stock1_alpha_vantage_data.get('MarketCapitalization', 'N/A'),  # Market Cap from Alpha Vantage
            'dividend_yield': stock1_alpha_vantage_data.get('DividendYield', 'N/A')  # Dividend Yield from Alpha Vantage
        },
        'stock2': {
            'symbol': symbol2,
            'price': stock2_finnhub_data['c'],
            'high': stock2_finnhub_data['h'],
            'low': stock2_finnhub_data['l'],
            'pe_ratio': stock2_alpha_vantage_data.get('PERatio', 'N/A'),
            'market_cap': stock2_alpha_vantage_data.get('MarketCapitalization', 'N/A'),
            'dividend_yield': stock2_alpha_vantage_data.get('DividendYield', 'N/A')
        }
    })

if __name__ == '__main__':
    print("Starting Flask server on port 5003...")
    app.run(debug=True, port=5003)
