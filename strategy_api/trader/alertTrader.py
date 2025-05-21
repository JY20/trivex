from configparser import ConfigParser
from components.alert import alert
from components.marketData import marketData

from strategy.averageRebalance import averageRebalance
from strategy.momentum import momentum
from configparser import ConfigParser


import logging
from datetime import datetime
import time
import pandas as pd

class alertTrader:
    def __init__(self, listSymbol):
        date = datetime.now().strftime("%Y_%m_%d")
        self.config = ConfigParser()
        self.config.read("./config/config.ini")
        self.level = self.config.get("LoggerConfig", "level");
        logging.basicConfig(filename="./logs/"+str(date)+".log", level=self.level.upper(), format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)

        self.alert = alert(self.logger)
        self.listSymbol = listSymbol
    
    def runAverageRebalanceAlert(self, sector, email):
        self.alert.setEmail(email)
        self.run(sector)

    def run(self, sector):
        self.logger.info("**********Starting Alert Trader**********")

        buySignals = {}
        sellSignals = {}

        listSymbol = self.listSymbol
        alpha_api_key = "6RTB6SLZGMV0N00L"

        count = 1
        for symbol in listSymbol:
            try:
                md = marketData(self.logger, symbol, sector)
                current_date = datetime.now().strftime('%Y-%m-%d')
                num_trading_days_back = 25
                result_date = md.get_trading_days_back(current_date, num_trading_days_back)
                data = md.fetch_market_data("1d", datetime.strptime(result_date, "%Y-%m-%d").date(), datetime.strptime(current_date, "%Y-%m-%d").date())
                curPrice = md.get_current_price()
                averageRebalanceSym = averageRebalance(symbol, self.logger, data)
                signal = averageRebalanceSym.next(curPrice)

                if signal == "Buy":
                    buySignals[symbol] = curPrice
                elif signal == "Sell":
                    sellSignals[symbol] = curPrice

                print(f"{count}/{len(listSymbol)}")
                self.logger.info(f"{count}/{len(listSymbol)}")
                count += 1

            except Exception as e:
                self.logger.error(f"Error in: {symbol} with error... {str(e)}")

        self.alert.emailAgg("Trivex Average Rebalance Alert Signal !!!", buySignals, sellSignals)
        self.logger.info("**********Finishing Alert Trader**********")

    def runMomentumAlert(self, sector, email):
        self.alert.setEmail(email)
        self.runMomentum(sector)

    def runMomentum(self, sector):
        self.logger.info("**********Starting Alert Trader**********")

        symbolList = self.listSymbol

        count = 1

        md = {}
        prices = {}
        curPrice = {}
        for symbol in symbolList:
            try:
                md[symbol] = marketData(self.logger, symbol, sector)
                current_date = datetime.now().strftime('%Y-%m-%d')
                num_trading_days_back = 30
                result_date = md[symbol].get_trading_days_back(current_date, num_trading_days_back)
                prices[symbol] = md[symbol].fetch_market_data("1d", datetime.strptime(result_date, "%Y-%m-%d").date(), datetime.strptime(current_date, "%Y-%m-%d").date())
                curPrice[symbol] = md[symbol].get_current_price()
                print(f"{count}/{len(symbolList)}")
                self.logger.info(f"{count}/{len(symbolList)}")
                count += 1
            except Exception as e:
                self.logger.error(f"Error in: {symbol} with error... {str(e)}")

        strategy = momentum(symbolList, self.logger, prices)
        symbols = strategy.next(curPrice)
        signal = strategy.getSignal()

        result = {}

        for symbol in symbols:
            result[symbol] = curPrice[symbol]

        self.alert.emailMomentum("Trivex Momentum Alert Signal !!!", signal, result)
        self.logger.info("**********Finishing Alert Trader**********")