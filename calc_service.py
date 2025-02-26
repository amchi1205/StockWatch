import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the API key and URL from environment variables
FINNHUB_API_KEY = os.getenv('FINNHUB_API_KEY', 'csoc6bhr01qt3r34997gcsoc6bhr01qt3r349980')
FINNHUB_URL = 'https://finnhub.io/api/v1/quote'

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        # Log the received request
        print("Received request to calculate potential return.")

        # Get data from the request
        data = request.get_json()
        print(f"Received data: {data}")

        # Validate required fields
        symbol = data.get('symbol')
        quantity = data.get('quantity')
        return_percentage = data.get('returnPercentage')
        years = data.get('years')

        if not all([symbol, quantity, return_percentage, years]):
            print("Missing required fields or invalid input data.")
            return jsonify({"error": "Missing required fields or invalid input data"}), 400

        # Convert values to appropriate types
        symbol = symbol.upper()
        print(f"Processing symbol: {symbol}")

        try:
            quantity = float(quantity)
            return_percentage = float(return_percentage)
            years = int(years)
            print(f"Converted values - Quantity: {quantity}, Return Percentage: {return_percentage}, Years: {years}")
        except ValueError:
            print("Invalid value for one or more input parameters.")
            return jsonify({"error": "Invalid value for one or more input parameters"}), 400

        # Fetch current stock price from Finnhub
        print(f"Fetching current price for stock symbol: {symbol}")
        response = requests.get(f"{FINNHUB_URL}?symbol={symbol}&token={FINNHUB_API_KEY}")
        
        if response.status_code != 200:
            print(f"Error fetching stock price from Finnhub. Status code: {response.status_code}")
            return jsonify({"error": "Error fetching stock price from Finnhub"}), 500

        stock_data = response.json()
        print(f"Received stock data: {stock_data}")

        if 'c' not in stock_data:
            print("Could not retrieve stock price. Invalid symbol?")
            return jsonify({"error": "Could not retrieve stock price. Please check the symbol."}), 400

        current_price = stock_data['c']
        print(f"Current stock price: {current_price}")

        # Calculate the initial investment value
        initial_investment = quantity * current_price
        print(f"Initial investment: {initial_investment}")

        # Calculate potential return using compound interest formula
        potential_return = initial_investment * (1 + return_percentage / 100) ** years
        print(f"Potential return after {years} years: {potential_return}")

        # Return the result as JSON
        return jsonify({
            'currentPrice': round(current_price, 2),
            'initialInvestment': round(initial_investment, 2),
            'potentialReturn': round(potential_return, 2)
        })

    except requests.exceptions.RequestException as e:
        # Handle issues with the request to Finnhub API
        print(f"Failed to connect to Finnhub API: {str(e)}")
        return jsonify({"error": f"Failed to connect to Finnhub API: {str(e)}"}), 500
    except Exception as e:
        # Catch any other unforeseen errors
        print(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5002)
