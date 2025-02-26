import matplotlib
matplotlib.use('Agg')  # Set non-GUI backend for matplotlib
import matplotlib.pyplot as plt
import io
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for the /generate route, allowing requests from your frontend
CORS(app, resources={r"/generate": {"origins": "http://127.0.0.1:5005"}})  # Allow only your frontend

@app.route('/generate', methods=['POST'])
def generate_graph():
    data = request.get_json()
    print(f"Received data for graph: {data}")

    # Extract stock data
    stock1 = data['stock1']
    stock2 = data['stock2']

    # Generate bar chart
    fig, ax = plt.subplots()
    ax.bar([stock1['symbol'], stock2['symbol']], [stock1['price'], stock2['price']])
    ax.set_title('Stock Price Comparison')
    ax.set_ylabel('Price ($)')
    
    # Convert the plot to Base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    graph_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Respond with Base64 image
    print("Graph generated successfully.")
    return jsonify({'image': graph_base64})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
