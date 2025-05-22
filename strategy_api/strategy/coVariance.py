from datetime import datetime, timedelta, date
import requests
import numpy as np
from components.marketData import marketData

class coVariance:
    def __init__(self, logger):
        self.logger = logger

    def calculate_covariance(self, symbol1, symbol2, start_date: date, end_date: date, interval="1d"):
        md1 = marketData(self.logger, symbol1, "none")
        md2 = marketData(self.logger, symbol2, "none")

        data1 = md1.fetch_market_data(interval, start_date, end_date)
        data2 = md2.fetch_market_data(interval, start_date, end_date)

        min_length = min(len(data1), len(data2))
        data1 = data1[:min_length]
        data2 = data2[:min_length]

        if len(data1) < 2 or len(data2) < 2:
            self.logger.error("Not enough data points for covariance calculation.")
            raise ValueError("Not enough data points to calculate covariance.")

        covariance = np.cov(data1, data2)[0, 1]
        self.logger.info(f"Covariance between {symbol1} and {symbol2} from {start_date} to {end_date}: {covariance}")
        return covariance
