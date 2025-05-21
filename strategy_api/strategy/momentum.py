import numpy as np

class momentum():
    def __init__(self, symbolList, logger, data):
        self.symbolList = symbolList
        self.logger = logger
        self.data = data
        self.signal = ""
        self.amount =  25

    def roc(self, curPrice, prevPrice):
        value = ((curPrice-prevPrice)/prevPrice)*100
        return value
    
    def sma(self, symbol, amount):
        total = 0
        for i in range(amount):
            total += self.data[symbol][-i]
        average = total/amount
        return average

    def getBottomSymbols(self):
        bottomSymbols = []
        count = 0
        for key, value in self.rev_sorted_dict.items():
            bottomSymbols.append(key)
            count += 1
            if count == self.amount:
                break
        return bottomSymbols
    
    def getTopSymbols(self):
        topSymbols = []
        count = 0
        for key, value in self.sorted_dict.items():
            topSymbols.append(key)
            count += 1
            if count == self.amount:
                break
        return topSymbols
    
    def getAllSymbols(self):
        topSymbols = []
        for key, value in self.sorted_dict.items():
            topSymbols.append(key)
        return topSymbols
    

    def getSignal(self):
        return self.signal

    def next(self, curPrice, day=7):
        results = {}
        temp = 0
        for symbol in self.symbolList:
            if(self.roc(curPrice[symbol], self.data[symbol][-30]) < 3):
                temp += 1
            results[symbol] = self.roc(curPrice[symbol], self.data[symbol][-day])

        self.sorted_dict = dict(sorted(results.items(), key=lambda item: item[1], reverse=True))
        self.rev_sorted_dict = dict(sorted(results.items(), key=lambda item: item[1], reverse=False))

        if(temp > 10):
            self.signal = "short"
            return self.getBottomSymbols()
        else:
            self.signal = "long"
            # return self.getTopSymbols()
            return self.getAllSymbols()