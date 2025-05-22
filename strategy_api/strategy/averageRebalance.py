import numpy as np

class averageRebalance():
    def __init__(self, symbol, logger, data):
        self.symbol = symbol
        self.logger = logger
        self.data = data

    def highest(self, num):
        highestPrice = self.data[-1]
        for i in range(num):
            if(self.data[-i-1] > highestPrice):
                highestPrice = self.data[-i-1]
        return highestPrice

    def lowest(self, num):
        lowestPrice = self.data[-1]
        for i in range(num):
            if(self.data[-i-1] < lowestPrice):
                lowestPrice = self.data[-i-1]
        return lowestPrice

    def sma(self, amount):
        total = 0
        for i in range(amount):
            total += self.data[-i]
        average = total/amount
        return average

    def roc(self, curPrice, prevPrice):
        value = ((curPrice-prevPrice)/prevPrice)*100
        return value

    def next(self, curPrice):
        weekly = 7
        monthly = 20
        deltaMax = 5
        if(curPrice < self.sma(monthly) and curPrice <= self.lowest(weekly)):
            roc = self.roc(curPrice, self.highest(weekly))
            if(roc < -deltaMax):
                return "Buy"
        elif(curPrice >= self.highest(weekly) and curPrice > self.sma(monthly)):
            roc = self.roc(curPrice, self.lowest(weekly))
            if(roc > deltaMax):
                return "Sell"
        else:
            return "None"
