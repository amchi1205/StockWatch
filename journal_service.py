from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

# In-memory storage for trades (use a database in production)
trades = []

# Helper function to generate unique trade ID
def generate_trade_id():
    return str(uuid.uuid4())

# Endpoint to add a new trade
@app.route('/add_trade', methods=['POST'])
def add_trade():
    data = request.json
    trade = {
        'id': generate_trade_id(),
        'symbol': data['symbol'],
        'entry_date': data['entry_date'],
        'entry_price': data['entry_price'],
        'exit_date': data.get('exit_date', ''),
        'exit_price': data.get('exit_price', ''),
        'quantity': data['quantity']
    }
    trades.append(trade)
    return jsonify(trade), 201

# Endpoint to get all trades
@app.route('/get_trades', methods=['GET'])
def get_trades():
    return jsonify(trades), 200

# Endpoint to delete a trade by ID
@app.route('/delete_trade/<trade_id>', methods=['DELETE'])
def delete_trade(trade_id):
    global trades
    trades = [trade for trade in trades if trade['id'] != trade_id]
    return '', 204

# Endpoint to update a trade by ID
@app.route('/update_trade/<trade_id>', methods=['PUT'])
def update_trade(trade_id):
    data = request.json
    for trade in trades:
        if trade['id'] == trade_id:
            trade.update(data)
            return jsonify(trade), 200
    return jsonify({'error': 'Trade not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5007)
