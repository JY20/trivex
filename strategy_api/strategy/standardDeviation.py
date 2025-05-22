import requests
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import numpy as np
from components.marketData import marketData

class standardDeviation():
    def __init__(self, logger, sector, symbol):
        self.logger = logger
        self.signal = ""
        self.md = marketData(self.logger, symbol, sector)
        self.API_ENDPOINT = "https://api.binance.com/api/v3/klines"
        self.ALPHA_VANTAGE_API_KEY = "6RTB6SLZGMV0N00L"

    def calculate_std_range(self, data, num_std_dev):
        mean = np.mean(data)
        std_dev = np.std(data)
        upper_bound = mean + num_std_dev * std_dev
        lower_bound = mean - num_std_dev * std_dev
        return mean, upper_bound, lower_bound

    def plot_distribution(self, data):
        plt.figure(figsize=(10, 6))
        plt.hist(data, bins=30, color="blue", alpha=0.7)
        plt.title("Distribution of Closing Prices")
        plt.xlabel("Closing Price")
        plt.ylabel("Frequency")
        plt.grid(axis="y", linestyle="--", alpha=0.7)
        plt.show()

    def closeSignal(self, sector, symbol, is_buy, close_std_dev):
        interval = "1h"
        days = 14

        closing_prices = self.md.fetch_market_data_days(interval, days)
        mean, upper_bound, lower_bound = self.calculate_std_range(closing_prices, close_std_dev)
        current_price = self.md.get_current_price()

        self.logger.info(f"Mean: {mean}")
        self.logger.info(f"Upper Bound (+{close_std_dev} Std Dev): {upper_bound}")
        self.logger.info(f"Lower Bound (-{close_std_dev} Std Dev): {lower_bound}")
        self.logger.info(f"Current price: {current_price}")

        if is_buy and current_price > upper_bound:
            return "close"
        elif not is_buy and current_price < lower_bound:
            return "close"
        else:
            return "none"

    def next(self, sector, symbol, open_std_dev):
        interval = "1h"
        days = 14

        closing_prices = self.md.fetch_market_data_days(interval, days)
        mean, upper_bound, lower_bound = self.calculate_std_range(closing_prices, open_std_dev)
        current_price = self.md.get_current_price()

        self.logger.info(f"Mean: {mean}")
        self.logger.info(f"Upper Bound (+{open_std_dev} Std Dev): {upper_bound}")
        self.logger.info(f"Lower Bound (-{open_std_dev} Std Dev): {lower_bound}")
        self.logger.info(f"Current price: {current_price}")

        if current_price < lower_bound:
            return "long"
        elif current_price > upper_bound:
            return "short"
        else:
            return "none"
