import requests
import pandas as pd
from datetime import datetime, timedelta, date

class marketData:
    def __init__(self, logger, symbol, sector):
        self.logger = logger
        self.symbol = symbol
        self.sector = sector
        self.API_ENDPOINT = "https://api.binance.com/api/v3/klines"
        self.ALPHA_VANTAGE_API_KEY = "6RTB6SLZGMV0N00L"

    def fetch_crypto_data(self, symbol, interval, start_date: date, end_date: date):
        start_time = int(datetime.combine(start_date, datetime.min.time()).timestamp() * 1000)
        end_time = int(datetime.combine(end_date, datetime.min.time()).timestamp() * 1000)
        params = {"symbol": symbol, "interval": interval, "startTime": start_time, "endTime": end_time, "limit": 1000}
        all_data = []

        while True:
            response = requests.get(self.API_ENDPOINT, params=params)
            response.raise_for_status()
            data = response.json()
            if not data:
                break
            all_data.extend(data)
            params["startTime"] = int(data[-1][0]) + 1
            if params["startTime"] > end_time:
                break
            
        return [float(entry[4]) for entry in all_data]

    def fetch_stock_data(self, symbol, start_date: date, end_date: date):
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={self.ALPHA_VANTAGE_API_KEY}&outputsize=full"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            if "Time Series (Daily)" not in data:
                self.logger.error(f"Alpha Vantage API error: {data.get('Note', 'No data returned.')}")
                raise ValueError(f"No stock data available for {symbol}")

            prices = []
            for date_str, info in data["Time Series (Daily)"].items():
                date_dt = datetime.strptime(date_str, "%Y-%m-%d").date()
                if start_date <= date_dt <= end_date:
                    prices.append(float(info["4. close"]))

            if not prices:
                self.logger.error(f"No stock data found for {symbol} between {start_date} and {end_date}")
                raise ValueError(f"No stock data available for {symbol}")

            return list(reversed(prices))

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed fetching stock data from Alpha Vantage for {symbol}: {str(e)}")
            raise

        end_time = int(datetime.utcnow().timestamp() * 1000)
        start_time = int((datetime.utcnow() - timedelta(days=days)).timestamp() * 1000)
        params = {"symbol": symbol, "interval": interval, "startTime": start_time, "endTime": end_time, "limit": 1000}
        all_data = []
        while True:
            response = requests.get(self.API_ENDPOINT, params=params)
            response.raise_for_status()
            data = response.json()
            if not data:
                break
            all_data.extend(data)
            params["startTime"] = int(data[-1][0]) + 1
            if params["startTime"] > end_time:
                break
        return [float(entry[4]) for entry in all_data]

    def fetch_market_data(self, interval, start_date: date, end_date: date):
        symbol_details = self.symbol.split("-")
        if len(symbol_details) == 2 and (symbol_details[1] == "USDT" or symbol_details[1] == "USDC" or symbol_details[1] == "USD"):
            return self.fetch_crypto_data(symbol_details[0] + "USDC", interval, start_date, end_date)
        else:
            return self.fetch_stock_data(symbol_details[0], start_date, end_date)
    
    def get_current_crypto_price(self, symbol):
        url = "https://api.binance.com/api/v3/ticker/price"
        params = {"symbol": symbol}
        response = requests.get(url, params=params)
        return float(response.json()["price"])

    def get_current_stock_price(self, symbol):
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": self.ALPHA_VANTAGE_API_KEY
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return float(data["Global Quote"]["05. price"])

    def get_current_price(self):
        if self.sector == "crypto":
            if "USDC" not in self.symbol:
                self.symbol = self.symbol.split("-")[0] + "USDC"
            return self.get_current_crypto_price(self.symbol)
        elif self.sector == "tsx":
            self.symbol = self.symbol + ".TO"
            return self.get_current_stock_price(self.symbol)
        elif self.sector == "sp500":
            return self.get_current_stock_price(self.symbol)
        else:
            raise ValueError("Invalid sector provided.")

    def fetch_crypto_data_days(self, symbol, interval, days):
        end_time = int(datetime.utcnow().timestamp() * 1000)
        start_time = int((datetime.utcnow() - timedelta(days=days)).timestamp() * 1000)
        params = {"symbol": symbol, "interval": interval, "startTime": start_time, "endTime": end_time, "limit": 1000}
        all_data = []
        while True:
            response = requests.get(self.API_ENDPOINT, params=params)
            response.raise_for_status()
            data = response.json()
            if not data:
                break
            all_data.extend(data)
            params["startTime"] = int(data[-1][0]) + 1
            if params["startTime"] > end_time:
                break
        
        return [float(entry[4]) for entry in all_data]

    def fetch_stock_data_days(self, symbol, days, interval="60min"):
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": symbol,
            "interval": interval,
            "apikey": self.ALPHA_VANTAGE_API_KEY,
            "outputsize": "full"
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        time_series_key = f"Time Series ({interval})"
        if time_series_key not in data:
            raise ValueError(f"Failed to fetch data for {symbol}, check symbol or API limit")

        all_prices = []
        end_datetime = datetime.utcnow()
        start_datetime = end_datetime - timedelta(days=days)

        for timestamp, values in data[time_series_key].items():
            ts_datetime = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
            if start_datetime <= ts_datetime <= end_datetime:
                all_prices.append(float(values["4. close"]))
        
        return list(reversed(all_prices))

    def fetch_market_data_days(self, interval, days):
        if self.sector == "crypto":
            if "USDC" not in self.symbol:
                self.symbol = self.symbol + "USDC"
            return self.fetch_crypto_data_days(self.symbol, interval, days)
        elif self.sector == "tsx":
            self.symbol = self.symbol + ".TO"
            return self.fetch_stock_data_days(self.symbol, days)
        elif sector == "sp500":
            return self.fetch_stock_data_days(self.symbol, days)
        else:
            raise ValueError("Invalid sector provided.")

    def get_trading_days_back(self, start_date, num_days):
        current_date = datetime.strptime(start_date, '%Y-%m-%d')
        while num_days > 0:
            current_date -= timedelta(days=1)
            if current_date.weekday() in [5, 6]:
                continue
            num_days -= 1
        return current_date.strftime('%Y-%m-%d')
