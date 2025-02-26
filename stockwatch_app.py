import os
import logging
import requests
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')

# Enable CORS for all routes to allow cross-origin requests
CORS(app)

# Load service URLs from environment variables
GRAPH_SERVICE_URL = os.getenv("GRAPH_SERVICE_URL", "http://127.0.0.1:5001/generate")
CALC_SERVICE_URL = os.getenv("CALC_SERVICE_URL", "http://127.0.0.1:5002/calculate")
STOCK_DATA_SERVICE_URL = os.getenv("STOCK_DATA_SERVICE_URL", "http://127.0.0.1:5003/stockdata")
STOCK_METRICS_SERVICE_URL = os.getenv("STOCK_METRICS_SERVICE_URL", "http://127.0.0.1:5004/metrics")

# Set logging level
app.logger.setLevel(logging.DEBUG)

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for the trades page
@app.route('/trades')
def trades():
    return render_template('trades.html')

# Route for comparing stocks
@app.route('/compare', methods=['GET', 'POST'])
def compare():
    if request.method == 'POST':
        # Get stock symbols from form data
        symbol1 = request.form.get('symbol1')
        symbol2 = request.form.get('symbol2')

        # Check if both symbols are provided
        if not symbol1 or not symbol2:
            return jsonify({"error": "Both stock symbols are required"}), 400

        # Placeholder stock data (replace with actual logic if needed)
        stock_data = {
            'stock1': {'symbol': symbol1, 'price': 100, 'peRatio': 15, 'marketCap': 5000000000, 'dividend': 1.5, 'volume': 300000},
            'stock2': {'symbol': symbol2, 'price': 150, 'peRatio': 18, 'marketCap': 6000000000, 'dividend': 2.0, 'volume': 400000}
        }

        # Send request to Graph Service for graph generation
        try:
            response = requests.post(GRAPH_SERVICE_URL, json=stock_data)
            response.raise_for_status()  # Raise exception for 4xx/5xx responses

            # Process response from Graph Service
            graph_data = response.json()
            image_data = graph_data.get('image')

            if not image_data:
                app.logger.error(f"Graph image data missing in response for {symbol1} vs {symbol2}")
                return jsonify({"error": "Graph image data missing"}), 500

            return render_template('compare.html', image_data=image_data)

        except requests.exceptions.RequestException as e:
            app.logger.error(f"Error communicating with Graph Service: {e}")
            return jsonify({"error": "Failed to generate graph."}), 500

    return render_template('compare.html')

# Route for the calculator page
@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

# Route for the stock search page
@app.route('/search')
def search():
    return render_template('search.html')

# Route for the help page
@app.route('/help')
def help_page():
    return render_template('help.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)
    