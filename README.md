# StockWatch: Real-Time Stock Tracking Platform

StockWatch is a **full-stack web application** that allows users to track real-time stock data, compare stocks, and maintain a trading journal. The application integrates with financial APIs to provide up-to-date stock metrics and visualizations.

This project was completed as part of **CS361 - Software Engineering I** at Oregon State University.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [How to Use](#how-to-use)
- [Future Improvements](#future-improvements)
- [Disclaimer](#disclaimer)

---

## Features
- **Real-Time Stock Data**: Fetches real-time stock metrics using the **Alpha Vantage** and **Finnhub APIs**.
- **Stock Comparison**: Allows users to compare multiple stocks and visualize their performance.
- **Trading Journal**: Tracks user trades with sorting, filtering, and undo functionality (SQL database integration in progress).
- **Investment Calculator**: Simulates potential returns based on user inputs.
- **Data Visualization**: Generates dynamic graphs to visualize stock performance.

---

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **APIs**: Alpha Vantage, Finnhub
- **Database**: SQL (in progress)
- **Version Control**: Git, GitHub

---

## Prerequisites
- Python 3.x
- Flask
- API keys from [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and [Finnhub](https://finnhub.io/).

---

## How to Use
### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/amchi1205/StockWatch.git

2. Navigate to the project directory:
bash
Copy
cd StockWatch
Install the required dependencies:
bash
Copy
pip install -r requirements.txt
Set up your API keys:
Rename .env.example to .env.
Add your API keys to the .env file.
Running the Application

Start the Flask server:
bash
Copy
python app.py
Open your browser and navigate to http://127.0.0.1:5000.
Future Improvements

SQL Database for Trading Journal: The trading journal currently uses in-memory storage. Future work will include integrating a SQL database to persist trade data.
User Authentication: Add user accounts to allow multiple users to track their trades independently.
Advanced Analytics: Implement additional analytics features, such as portfolio performance tracking and risk assessment.
Improved UI/UX: Enhance the user interface with modern design elements and interactive charts.
Disclaimer

This project was completed as part of CS361 - Software Engineering I at Oregon State University. It is intended for educational purposes and is not open for contributions or external use.

Copy

---

### **7. Commit and Push**
Once you’ve made these changes, commit and push them to GitHub:

```bash
git add .
git commit -m "Update README, add .env.example, and organize repository structure"
git push origin main
